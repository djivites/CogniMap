


def load_file(path: str) -> str:
    import os
    from langchain_community.document_loaders import (
        TextLoader,
        JSONLoader,
        CSVLoader,
        PyPDFLoader,
        UnstructuredFileLoader
    )
    ext = os.path.splitext(path)[-1].lower()
    if ext == ".txt":
        loader = TextLoader(path)
    elif ext == ".json":
        loader = JSONLoader(path, jq_schema=".")
    elif ext == ".csv":
        loader = CSVLoader(path)
    elif ext == ".pdf":
        loader = PyPDFLoader(path)
    else:
        loader = UnstructuredFileLoader(path)

    docs = loader.load()
    return "\n".join(doc.page_content for doc in docs)