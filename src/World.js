import React from 'react';
import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import block from './models/block.glb';

function World(props) {
  const loader  = new GLTFLoader();

  loader.load(block, (d) =>{
    const entity = document.getElementById("block");
    entity.object3D.add(d.scene);
  })

  return (
    <a-scene>
      <a-assets>
        <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
        <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>
      </a-assets>

      <a-sky
        material="src: #skyTexture"
        rotation="0 0 0"
        height="2048"
        radius="30"
        theta-length="90"
        width="2048"/>
      <a-plane
        material="src: #groundTexture"
        rotation="-90 0 0"
        height="100"
        width="100"/>
      <a-entity id="block" 
        position="-.042 .595 -2.45"
        rotation="90 90 0" 
        scale=".14 .41 .16"/>
      <a-camera position="0 1.6 .8">
        <a-cursor></a-cursor>
      </a-camera>
    </a-scene>
  );
}
export default World