// Function to start BFS when selected from the dropdown
function bfs(startNodeId) {
    if (nodes.length === 0) return;
    
    // Initial setup for BFS
    let visited = new Set();
    let queue = [];
    let order = []; // Keeps track of the visiting order of nodes

    // Find the starting node
    const startNode = nodes.find(node => node.id === startNodeId);
    if (!startNode) return;

    // Initialize BFS
    queue.push(startNode);
    visited.add(startNode.id);
    order.push(startNode.id);

    // Breadth-First Search loop
    while (queue.length > 0) {
        const currentNode = queue.shift();
        const currentNodeElement = nodes.find(node => node.id === currentNode.id);

        // Change node color to represent visiting
        drawNode(currentNodeElement.x, currentNodeElement.y, currentNodeElement.id, '#f97316');

        // Get the adjacent nodes (edges)
        const adjacentNodes = getAdjacentNodes(currentNode.id);

        adjacentNodes.forEach(neighborId => {
            const neighborNode = nodes.find(node => node.id === neighborId);

            if (!visited.has(neighborNode.id)) {
                visited.add(neighborNode.id);
                queue.push(neighborNode);
                order.push(neighborNode.id);

                // Change edge color when traversed
                drawEdge(currentNode.id, neighborNode.id, false); // Not directed
            }
        });
    }

    // Revert all node colors to original after BFS is done
    setTimeout(() => {
        redrawCanvas(); // Redraw the canvas after BFS completes
    }, 1000); // Give some time for the BFS traversal effect
}

// Function to get adjacent nodes for BFS
function getAdjacentNodes(nodeId) {
    const adjacentNodes = [];
    edges.forEach(edge => {
        if (edge.from === nodeId) {
            adjacentNodes.push(edge.to);
        } else if (edge.to === nodeId && !edge.directed) {
            adjacentNodes.push(edge.from);
        }
    });
    return adjacentNodes;
}
