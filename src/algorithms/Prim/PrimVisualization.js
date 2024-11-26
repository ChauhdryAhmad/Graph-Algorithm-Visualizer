import { useState, useEffect } from "react";
import asyncTimeOut from "../../helpers/asyncTimeOut";
import MinHeap from "../../helpers/dataStructures/MinHeap";


// const delayTime = 1000
const PrimVisualization = (props) => {
  const vertexIndices = new Map();
  const parent = new Array(props.noOfVertices);
  const delayTime = props.visualizationSpeed
  const visualizePrim = async () => {
    const minHeap = new MinHeap(props.noOfVertices);
    minHeap.decreaseKey(props.startingVertex, 0);

    while (!minHeap.isEmpty()) {
      const vertexID = props.vertexIDs[minHeap.extractMin()];
      const neighbours = props.adjList
        .get(vertexID)
        .map((edgeID) => props.edgeRefs.get(edgeID));

      props.vertexRefs.get(vertexID).current.changeBackgroundColor("#01B878");
      await asyncTimeOut(delayTime);

      for (var i = 0; i < neighbours.length; i++) {
        const connectedVertexIndex = vertexIndices.get(
          neighbours[i].current.getOtherVertexID(vertexID)
        );
        if (!minHeap.isPresent(connectedVertexIndex)) continue;

        const weight = parseInt(neighbours[i].current.props.weight);

        neighbours[i].current.changeBackgroundColor("#ED3C61");
        await asyncTimeOut(delayTime);

        if (minHeap.decreaseKey(connectedVertexIndex, weight)) {
          const prevConnectedEdge = parent[connectedVertexIndex];

          if (prevConnectedEdge != -1)
            prevConnectedEdge.current.changeBackgroundColor("#CDCDCD");

          neighbours[i].current.changeBackgroundColor("#01B878");
          parent[connectedVertexIndex] = neighbours[i];
        } else {
          neighbours[i].current.changeBackgroundColor("#CDCDCD");
        }

        await asyncTimeOut(delayTime);
      }
    }

    props.endVisualizing();
  };

  useEffect(() => {
    for (var i = 0; i < props.noOfVertices; i++) {
      vertexIndices.set(props.vertexIDs[i], i);
    }
    parent.fill(-1);

    visualizePrim();
  }, []);

  return <div></div>;
};

export default PrimVisualization;
