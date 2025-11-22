import { useState, useEffect, useRef, use } from "react";

import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { drawBoard } from "./board";
import {fitRendererToCanvas, cloneWithUniqueMaterials, tintObject} from './utilsTHREE';

export default function Game({roomNumber, players, socket, username, setPlayers}){
  const launchDice = () => {
    var isYourTurnToPlay = false;
    for(const player of players){
      if(player.isPlaying && player.username === username){
        isYourTurnToPlay = true;
        socket.emit("launchDice", username, roomNumber);
      }
    }
    if(!isYourTurnToPlay){
      console.log("PAS TON TOUR BATARD !")
    }
  }

  const canvasRef = useRef(null);
  const diceRef = useRef(null);

  const color = ["#faf703", "#57cbff", "#ff0100", "#29db00"];

  useEffect(() => {
    const dice = diceRef.current;

    socket.on("diceLaunched", (diceNumber) => {
      dice.src = `dice0${diceNumber}.png`;
    })

    socket.on("turnChanged", players => {
      setPlayers(players)
    })

    socket.on("movablePawns", movablePawns => {
      console.log(movablePawns);
    })

    const canvas = canvasRef.current;
    if(!canvas) return;

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0000FF);

    fitRendererToCanvas(renderer, camera, canvas);

    camera.position.set(0, 3, 10);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(0, 10, 0)
    scene.add(ambient, dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.5;

    var pawns = null;

    const board = drawBoard();
    scene.add(board);

    const objLoader = new OBJLoader();
      objLoader.load('pion.obj', (root) => {
        const pionPrototype = root;

        function createPion(x, z, color, id) {
          
          const model = cloneWithUniqueMaterials(pionPrototype);
          tintObject(model, color);

          const box = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          const size = new THREE.Vector3();
          box.getCenter(center);
          box.getSize(size);
          
          const pivot = new THREE.Group();
          pivot.position.set(x, 0, z);
            
          model.position.sub(center);     
          model.position.y += size.y / 2; 
          
          pivot.userData = { id, color, isSelected: false };
          model.userData = { kind: "pawnModel" }; 
          
          pivot.add(model);
          scene.add(pivot);

          return pivot; 
        }

        const tmpPawns = [
          createPion(-8, -8, "#faf703", 'A'),
          createPion(-12, -8, "#faf703", 'B'),
          createPion(-8, -12, "#faf703", 'C'),
          createPion(-12, -12, "#faf703", 'D'),

          createPion( 8,  8, "#ff0100", 'E'),
          createPion( 12,  8, "#ff0100", 'F'),
          createPion( 8,  12, "#ff0100", 'G'),
          createPion( 12,  12, "#ff0100", 'H'),

          createPion( 8, -8, "#57cbff", 'I'),
          createPion( 12, -8, "#57cbff", 'J'),
          createPion( 8, -12, "#57cbff", 'K'),
          createPion( 12, -12, "#57cbff", 'L'),

          createPion(-8,  8, "#29db00", 'M'),
          createPion(-12,  8, "#29db00", 'N'),
          createPion(-8,  12, "#29db00", 'O'),
          createPion(-12,  12, "#29db00", 'P'),

        ];

        pawns = tmpPawns;
    });


    function render() {
      controls.update();
      renderer.render(scene, camera);
    
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

  }, [])

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <div id="players">
        {players.map((player, index) => (
          <div key={index} id="player" style={{backgroundColor: color[index], height: player.isPlaying ? 150 : 100}}>
            <p>{player.username === username ? "Toi" : player.username}</p>
          </div>
        ))}
      </div>
      <div id="whosTurn">
        A {players.map(player => (player.isPlaying === true ? player.username === username ? "toi" : player.username : null))} de jouer
      </div>
      <img src="dice01.png" alt="dice" onClick={launchDice} ref={diceRef}/>
    </>
  )
}