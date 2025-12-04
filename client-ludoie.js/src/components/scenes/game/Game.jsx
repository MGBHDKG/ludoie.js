import { useEffect, useRef,  } from "react";

import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Player, Players, Dice, WhosTurn, TurnHandler, WhosTurnWrapper, Arrow } from "./GameStyle";

import { drawBoard } from "./board";
import {fitRendererToCanvas, cloneWithUniqueMaterials, tintObject} from './utilsTHREE';
import { drawMovablePawns, movePawn, movePawnToBase, movePawnToEndCase, unhighlightMovablePawns } from "./pawn";
import { handleDice, handleDiceWithKeyboard } from "./dice";

export default function Game({roomNumber, players, socket, username, setPlayers}){
  const launchDice = () => handleDice(players, socket, username, roomNumber);
  handleDiceWithKeyboard(players, socket, username, roomNumber);

  const canvasRef = useRef(null);
  const diceRef = useRef(null);
  const pawnsRef = useRef([]);
  const movablePawnsRef = useRef([]);

  const color = ["#faf703", "#57cbff", "#ff0100", "#29db00"];

  useEffect(() => {
    const dice = diceRef.current;

    socket.on("diceLaunched", (diceNumber) => {
      dice.src = `dice0${diceNumber}.png`;
    })

    socket.on("gameIsFinished", winner => {
      alert(winner + " a gagné la game !");
    })

    socket.on("turnChanged", players => {
      setPlayers(players);
      dice.src = `dice00.png`;
    })

    socket.on("movablePawns", movablePawns => {
      movablePawnsRef.current = movablePawns;
      drawMovablePawns(pawnsRef, movablePawns);
    });

    socket.on("movePawn", (pawnId, boardIndex) => {
      movePawn(pawnId, boardIndex, pawnsRef);
      unhighlightMovablePawns(pawnsRef, movablePawnsRef);
    });

    socket.on("movePawnToEndCase", (pawnId, playerIndex, endCaseIndex) => {
      movePawnToEndCase(pawnId, playerIndex, endCaseIndex, pawnsRef);
      unhighlightMovablePawns(pawnsRef, movablePawnsRef);
    });

    socket.on("backToBase", (pawnId) => {
      movePawnToBase(pawnId, pawnsRef);
    });


    const canvas = canvasRef.current;
    if(!canvas) return;

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x267182);

    fitRendererToCanvas(renderer, camera, canvas);

    camera.position.set(0, 3, 10);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(0, 10, 0)
    scene.add(ambient, dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.5;

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
          
          // ⬇️ on ajoute baseX / baseZ
          pivot.userData = { 
            id, 
            color, 
            isSelected: false,
            baseX: x,
            baseZ: z,
          };
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

          createPion( 8, -8, "#57cbff", 'E'),
          createPion( 12, -8, "#57cbff", 'F'),
          createPion( 8, -12, "#57cbff", 'G'),
          createPion( 12, -12, "#57cbff", 'H')
        ];

        if(players.length > 2){
          tmpPawns.push(createPion( 8,  8, "#ff0100", 'I'))
          tmpPawns.push(createPion( 12,  8, "#ff0100", 'J'))
          tmpPawns.push(createPion( 8,  12, "#ff0100", 'K'))
          tmpPawns.push(createPion( 12,  12, "#ff0100", 'L'))
        }

        if(players.length > 3){
          tmpPawns.push(createPion(-8,  8, "#29db00", 'M'))
          tmpPawns.push(createPion(-12,  8, "#29db00", 'N'))
          tmpPawns.push(createPion(-8,  12, "#29db00", 'O'))
          tmpPawns.push(createPion(-12,  12, "#29db00", 'P'))
        }

        pawnsRef.current = tmpPawns;
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
      if (!canvas) return;

      // coordonées de la souris dans le canvas
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);

      // récupérer tous les meshes des pions
      const pawnMeshes = [];
      pawnsRef.current.forEach(pawn => {
        pawn.traverse(obj => {
          if (obj.isMesh) pawnMeshes.push(obj);
        });
      });

      const intersects = raycaster.intersectObjects(pawnMeshes, true);
      if (intersects.length === 0) return;

      const clickedMesh = intersects[0].object;

      // remonter jusqu’au pivot qui a l'id du pion
      let pivot = clickedMesh;
      while (pivot && !pivot.userData?.id) {
        pivot = pivot.parent;
      }
      if (!pivot) return;

      const pawnId = pivot.userData.id;

      console.log(movablePawnsRef);

      // seulement si ce pion fait partie des pions jouables
      if (!movablePawnsRef.current.includes(pawnId)) {
        console.log("Ce pion n'est pas jouable pour ce tour.");
        return;
      }

      console.log("Pion cliqué :", pawnId);

      // petit feedback visuel de sélection
      pivot.traverse(obj => {
        if (obj.isMesh) {
          obj.material.emissive ||= new THREE.Color(0x000000);
          obj.material.emissive.set(0x333333);
        }
      });

      // informer le serveur que ce pion a été choisi
      const player = players.find(p => p.username === username);

      socket.emit("pawnSelected", 
        pawnId,
        roomNumber,
        player.username,
      );
    }

    canvas.addEventListener("click", onClick);

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
      <Players>
        {players.map((player, index) => (
          <Player key={index} style={{backgroundColor: color[index], height: player.isPlaying ? 150 : 100}}>
            <p>{player.username === username ? "Toi" : player.username}</p>
          </Player>
        ))}
      </Players>
      <TurnHandler>
        <WhosTurnWrapper>
          <WhosTurn>
            A {players.map(player => (player.isPlaying === true ? player.username === username ? "toi" : player.username : null))} de jouer
          </WhosTurn>
        </WhosTurnWrapper>
        {players.map(player => (player.isPlaying === true ? player.username === username ? <Arrow src="arrow.png"/> : null : null))}
        <Dice src="dice00.png" alt="dice" onClick={launchDice} ref={diceRef}/>
      </TurnHandler>
    </>
  )
}