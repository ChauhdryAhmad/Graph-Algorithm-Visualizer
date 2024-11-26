import { useState, useEffect } from "react";
import asyncTimeOut from "../../helpers/asyncTimeOut";

//const delayTime = 1000;
const DfsVisualization = (props) => {
  const vertexIndices = new Map();
  const delayTime = props.visualizationSpeed
  const [parent, setParent] = useState(new Array(props.noOfVertices).fill(-1));

  const DFSAlgo = async (vertexID) => {
    const incidentEdges = props.adjList.get(vertexID);
    const connectedVerticesID = incidentEdges.map((id) =>
      props.edgeRefs.get(id).current.getOtherVertexID(vertexID)
    );

    for (var i = 0; i < connectedVerticesID.length; i++) {
      const vertexIndex = vertexIndices.get(connectedVerticesID[i]);

      if (parent[vertexIndex] === -1) {
        var newParent = parent;
        newParent[vertexIndex] = vertexIndices.get(vertexID);

        await asyncTimeOut(delayTime);

        props.edgeRefs
          .get(incidentEdges[i])
          .current.changeBackgroundColor("#ED3C61");
        props.vertexRefs
          .get(connectedVerticesID[i])
          .current.changeBackgroundColor("#ED3C61");

        setParent(newParent);

        await DFSAlgo(connectedVerticesID[i]);
        await asyncTimeOut(delayTime);

        props.vertexRefs
          .get(connectedVerticesID[i])
          .current.changeBackgroundColor("#01B878");
        props.edgeRefs
          .get(incidentEdges[i])
          .current.changeBackgroundColor("#01B878");
      }
    }
  };

  const visualizeDFS = async () => {
    var newParent = parent;
    newParent[props.startingVertex] = props.startingVertex;

    await asyncTimeOut(delayTime);
    props.vertexRefs
      .get(props.vertexIDs[props.startingVertex])
      .current.changeBackgroundColor("#ED3C61");

    setParent(newParent);

    await DFSAlgo(props.vertexIDs[props.startingVertex]);
    
    await asyncTimeOut(delayTime);

    props.vertexRefs
      .get(props.vertexIDs[props.startingVertex])
      .current.changeBackgroundColor("#01B878");
      
      props.endVisualizing();
  };

  useEffect(() => {
    for (var i = 0; i < props.noOfVertices; i++) {
      vertexIndices.set(props.vertexIDs[i], i);
    }
    visualizeDFS();
  }, []);

  // create component for DFS data
  // here we need to return that
  return <div></div>;
};

export default DfsVisualization;
