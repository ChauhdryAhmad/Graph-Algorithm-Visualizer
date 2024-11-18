document.addEventListener('DOMContentLoaded', () => {
    const addNodeBtn = document.getElementById('add-node');
    const addEdgeBtn = document.getElementById('add-edge');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const matrixContent = document.getElementById('matrix-content');
    const listContent = document.getElementById('list-content');
    const edgeModal = document.getElementById('edge-modal');
    const fromNodeInput = document.getElementById('from-node');
    const toNodeInput = document.getElementById('to-node');
    const directedCheckbox = document.getElementById('directed');
    const weightedCheckbox = document.getElementById('weighted');
    const weightInput = document.getElementById('weight');
    const addEdgeConfirmBtn = document.getElementById('add-edge-confirm');
    const closeModalBtn = document.getElementById('close-modal');
    const deleteNodeBtn = document.getElementById('delete-node');
    const algorithmSelect = document.getElementById('algorithm-select');
    const visualizeBtn = document.getElementById('visualize');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let nodes = [];
    let edges = [];
    let nodeId = 0;

    let isAddingNode = false;
    let draggingNode = null;

    let isDeletingNode = false;

    // Add Node mode toggle
    addNodeBtn.addEventListener('click', () => {
        isAddingNode = true;
    });

    deleteNodeBtn.addEventListener('click', () => {
        isDeletingNode = true;
    });

    canvas.addEventListener('mousedown', (event) => {
        if (isAddingNode) {
            addNode(event);
            isAddingNode = false; // Disable adding mode after adding one node
        } else if (isDeletingNode) {
            const x = event.offsetX;
            const y = event.offsetY;
    
            const clickedNode = nodes.find(
                (node) => Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) <= 20 // 20 is the node radius
            );
    
            if (clickedNode) {
                deleteNode(clickedNode.id);
            }
            isDeletingNode = false; // Disable delete mode after deleting one node
        } else {
            startDragging(event);
        }
    });
    

    canvas.addEventListener('mousemove', (event) => {
        if (draggingNode) {
            dragNode(event);
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (draggingNode) {
            draggingNode = null;
        }
    });
    

    addEdgeBtn.addEventListener('click', () => {
        showEdgeModal();
    });

    
    visualizeBtn.addEventListener('click', () => {
        const selectedAlgorithm = algorithmSelect.value;

        // Check if BFS is selected
        if (selectedAlgorithm === 'bfs') {
            const startNodeId = parseInt(prompt('Enter the starting node ID for BFS:'));
            if (isNaN(startNodeId)) {
                alert('Invalid node ID');
                return;
            }
            bfs(startNodeId);
        }
    });
    

    clearCanvasBtn.addEventListener('click', () => {
        nodes = [];
        edges = [];
        nodeId = 0;
        clearCanvas();
        updateRepresentations();
        canvas.removeEventListener('click', addNode);
    });

    closeModalBtn.addEventListener('click', () => {
        edgeModal.style.display = 'none';
    });

    function addNode(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        if (!isWithinCanvas(x, y)) return;

        nodes.push({ id: nodeId, x, y });
        drawNode(x, y, nodeId);
        nodeId++;
        updateRepresentations();
    }

    function startDragging(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        // Check if the click is within a node
        draggingNode = nodes.find(
            (node) =>
                Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) <= 20 // 20 is the node radius
        );
    }

    function dragNode(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        if (draggingNode && isWithinCanvas(x, y)) {
            draggingNode.x = x;
            draggingNode.y = y;
            updateRepresentations(); // Redraw canvas with the node at its new position
        }
    }

    function showEdgeModal() {
        fromNodeInput.value = "";
        toNodeInput.value = "";
        directedCheckbox.checked = false;
        weightedCheckbox.checked = false;
        weightInput.value = "";
        weightInput.disabled = true;
        edgeModal.style.display = 'flex';  
    }
    

    // Enable/disable weight input based on the weighted checkbox
    weightedCheckbox.addEventListener('change', () => {
        weightInput.disabled = !weightedCheckbox.checked;
    });

    // Confirm edge addition
    addEdgeConfirmBtn.addEventListener('click', () => {
        const fromNodeId = parseInt(fromNodeInput.value);
        const toNodeId = parseInt(toNodeInput.value);
        const directed = directedCheckbox.checked;
        const weighted = weightedCheckbox.checked;
        const weight = weighted ? parseInt(weightInput.value) : null;

        if (!isValidNode(fromNodeId) || !isValidNode(toNodeId)) {
            alert("Invalid node IDs. Please try again.");
            return;
        }

        // Check if the edge already exists
        if (edges.some(edge => edge.from === fromNodeId && edge.to === toNodeId && edge.directed === directed)) {
            alert("Edge already exists.");
            return;
        }

        edges.push({ from: fromNodeId, to: toNodeId, directed, weight });
        drawEdge(fromNodeId, toNodeId, directed, weight);
        updateRepresentations();

        edgeModal.style.display = 'none';
    });

    function drawNode(x, y, id) {
        const radius = 20;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(id, x, y);
    }

    function drawEdge(fromId, toId, directed, weight) {
        const fromNode = nodes.find(node => node.id === fromId);
        const toNode = nodes.find(node => node.id === toId);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = directed ? '#f97316' : '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (weight !== null) {
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.fillStyle = '#000000';
            ctx.fillText(weight, midX, midY);
        }

        if (directed) {
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            const arrowLength = 10;
            const arrowX = toNode.x - arrowLength * Math.cos(angle - Math.PI / 6);
            const arrowY = toNode.y - arrowLength * Math.sin(angle - Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(toNode.x, toNode.y);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
        }
    }

    function isValidNode(id) {
        return nodes.some(node => node.id === id);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateRepresentations() {
        updateMatrix();
        updateList();
        redrawCanvas();
    }

    function updateMatrix() {
        const existingNodeIds = nodes.map(node => node.id);
        const matrixSize = existingNodeIds.length;
        const matrix = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
    
        edges.forEach(edge => {
            const fromIndex = existingNodeIds.indexOf(edge.from);
            const toIndex = existingNodeIds.indexOf(edge.to);
    
            if (fromIndex !== -1 && toIndex !== -1) {
                matrix[fromIndex][toIndex] = edge.weight || 1;
                if (!edge.directed) {
                    matrix[toIndex][fromIndex] = edge.weight || 1;
                }
            }
        });
    
        // Generate HTML with row and column labels
        let matrixHTML = '<table border="1" cellspacing="0" cellpadding="5">';
        matrixHTML += '<tr><th></th>' + existingNodeIds.map(id => `<th>${id}</th>`).join('') + '</tr>';
    
        matrix.forEach((row, i) => {
            matrixHTML += `<tr><th>${existingNodeIds[i]}</th>`;
            matrixHTML += row.map(value => `<td>${value}</td>`).join('');
            matrixHTML += '</tr>';
        });
    
        matrixHTML += '</table>';
        matrixContent.innerHTML = matrixHTML;
    }
    

    function updateList() {
        const adjacencyList = {};

        nodes.forEach(node => {
            adjacencyList[node.id] = [];
        });

        edges.forEach(edge => {
            adjacencyList[edge.from].push(edge.weight ? `${edge.to}(${edge.weight})` : edge.to);
            if (!edge.directed) {
                adjacencyList[edge.to].push(edge.weight ? `${edge.from}(${edge.weight})` : edge.from);
            }
        });

        listContent.innerHTML = Object.keys(adjacencyList)
            .map(node => `${node}: ${adjacencyList[node].join(', ')}`)
            .join('<br>');
    }

    function redrawCanvas() {
        clearCanvas();
        nodes.forEach(node => drawNode(node.x, node.y, node.id));
        edges.forEach(edge => drawEdge(edge.from, edge.to, edge.directed, edge.weight));
    }

    function isWithinCanvas(x, y) {
        return x >= 20 && y >= 20 && x <= canvas.width - 20 && y <= canvas.height - 20;
    }

    // Function to delete a node and all associated edges
    function deleteNode(nodeId) {
        nodes = nodes.filter(node => node.id !== nodeId);
        edges = edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);
        updateRepresentations();
    }

    // Function to delete an edge
    function deleteEdge(fromNodeId, toNodeId) {
        edges = edges.filter(edge => !(edge.from === fromNodeId && edge.to === toNodeId));
        updateRepresentations();
    }
});
