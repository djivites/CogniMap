import os
import uuid
import json
import numpy as np
import google.generativeai as genai
import networkx as nx
import matplotlib.pyplot as plt
from textwrap import fill


genai.configure(api_key="AIzaSyDFfTdQnF1eKZ2PYcm_GwzhX74vqljRnWY")



def generate_mindmap_json(summary_text):
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
    You are a mind map generator.
    Convert the following text summary into a JSON tree structure
    with the format:
    {{
      "root": "Main Topic",
      "children": [
        {{"node": "Subtopic 1"}},
        {{"node": "Subtopic 2", "children": [{{"node": "Detail"}}]}}
      ]
    }}
    Only output valid JSON. Do not include markdown formatting.

    Summary:
    {summary_text}
    """

    response = model.generate_content(prompt)
    raw_text = response.text.strip()

    
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.split("\n", 1)[1] if "\n" in raw_text else raw_text
        if raw_text.endswith("```"):
            raw_text = raw_text.rsplit("```", 1)[0]

    try:
        return json.loads(raw_text)
    except Exception as e:
        raise ValueError("Gemini output not valid JSON: " + raw_text) from e


#Create and Save Mindmap 
def save_mindmap_image(mindmap_json, output_path="mindmap.png"):
    G = nx.DiGraph()

    # Recursive builder
    def add_nodes(parent, children, depth=1):
        for child in children:
            node = child["node"]
            G.add_node(node, depth=depth)
            G.add_edge(parent, node)
            if "children" in child:
                add_nodes(node, child["children"], depth + 1)

    root = mindmap_json["root"]
    G.add_node(root, depth=0)
    add_nodes(root, mindmap_json.get("children", []))

    #Radial Layout
    def radial_layout(G, root):
        depths = nx.single_source_shortest_path_length(G, root)
        max_depth = max(depths.values())
        pos = {}
        for depth in range(max_depth + 1):
            nodes_at_depth = [n for n, d in depths.items() if d == depth]
            angle_step = 2 * np.pi / max(len(nodes_at_depth), 1)
            radius = (depth + 1) * 2.5
            for i, node in enumerate(nodes_at_depth):
                angle = i * angle_step
                pos[node] = (radius * np.cos(angle), radius * np.sin(angle))
        return pos

    pos = radial_layout(G, root)

    # Colors by depth
    depth_colors = {
        0: "#ff9999",   # root
        1: "#99ccff",   # first level
        2: "#99ff99",   # second level
        3: "#ffe680",   # deeper
    }

    # Plot
    plt.figure(figsize=(12, 12))
    ax = plt.gca()
    ax.set_facecolor("white")
    plt.axis("off")

    # Draw edges
    nx.draw_networkx_edges(G, pos, edge_color="gray", width=1.5, alpha=0.6, arrows=False)

    # Draw nodes as fancy labels
    for node, (x, y) in pos.items():
        depth = G.nodes[node].get("depth", 1)
        color = depth_colors.get(depth, "#e0e0e0")

        plt.text(
            x, y, fill(node, 20),
            fontsize=10, ha="center", va="center", weight="bold",
            bbox=dict(
                boxstyle="round,pad=0.5,rounding_size=0.4",
                facecolor=color, edgecolor="black", linewidth=1.2, alpha=0.9
            )
        )

    plt.title("Mind Map", fontsize=18, fontweight="bold", pad=20)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()
    return output_path


# Wrapper Function 
def generate_and_return_mindmap(summary_text):
    mindmap_json = generate_mindmap_json(summary_text)
    filename = f"mindmap_{uuid.uuid4().hex}.png"
    os.makedirs("outputs", exist_ok=True)
    output_path = os.path.join("outputs", filename)
    return save_mindmap_image(mindmap_json, output_path)








