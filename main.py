from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

# Allow frontend access (adjust origin in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str = Field(..., description="Unique identifier for the node")

class Edge(BaseModel):
    id: str = Field(..., description="Unique identifier for the edge")
    source: str = Field(..., description="ID of the source node")
    target: str = Field(..., description="ID of the target node")

class Pipeline(BaseModel):
    nodes: List[Node] = Field(..., description="List of nodes in the pipeline")
    edges: List[Edge] = Field(..., description="List of edges connecting nodes")

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    # Validate all edge references
    node_ids = {node.id for node in pipeline.nodes}
    for edge in pipeline.edges:
        if edge.source not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge {edge.id} references non-existent source node {edge.source}"
            )
        if edge.target not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge {edge.id} references non-existent target node {edge.target}"
            )

    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)

    adj = {node.id: [] for node in pipeline.nodes}
    in_degree = {node.id: 0 for node in pipeline.nodes}

    for edge in pipeline.edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = [n for n in in_degree if in_degree[n] == 0]
    visited = 0

    while queue:
        curr = queue.pop(0)
        visited += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    is_dag = visited == num_nodes

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
    }