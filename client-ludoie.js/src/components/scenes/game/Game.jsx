import { useEffect, useRef,  } from "react";

import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { drawBoard, BOARD_POSITIONS, END_BASE_POSITIONS } from "./board";
import {fitRendererToCanvas, cloneWithUniqueMaterials, tintObject} from './utilsTHREE';

export default function Game({roomNumber, players, socket, username, setPlayers}){
  const launchDice = () => {
    var isYourTurnToPlay = false;
    for(const player of players){
      if(player.isPlaying && player.username === username){
        isYourTurnToPlay = true;
        socket.emit("launchDice", username, roomNumber, undefined);
      }
    }
    if(!isYourTurnToPlay){
      console.log("PAS TON TOUR BATARD !")
    }
  }

  window.addEventListener("keydown", (event) => {
      if(event.key >= "1" && event.key <= "6"){
        var isYourTurnToPlay = false;
        for(const player of players){
          if(player.isPlaying && player.username === username){
            isYourTurnToPlay = true;
            socket.emit("launchDice", username, roomNumber, Number(event.key));
          }
        }
        if(!isYourTurnToPlay){
          console.log("PAS TON TOUR BATARD !")
        }
      }
    })

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

    socket.on("turnChanged", players => {
      setPlayers(players)
    })

    socket.on("movablePawns", movablePawns => {
      console.log("Pions déplaçables :", movablePawns);

      movablePawnsRef.current = movablePawns;

      pawnsRef.current.forEach(pawn => {
        const isMovable = movablePawns.includes(pawn.userData.id);

        pawn.traverse(obj => {
          if (!obj.isMesh) return;

          // enlever un éventuel highlight précédent
          if (obj.material.emissive) {
            obj.material.emissive.set(0x000000);
          }

          if (isMovable) {
            // feedback visuel : par ex. blanc
            obj.material.color.set("#FFFFFF");
            obj.material.opacity = 1;
            obj.material.transparent = false;
          } else {
            // remettre la couleur du joueur
            obj.material.color.set(pawn.userData.color);
            obj.material.opacity = 1;
            obj.material.transparent = false;
          }
        });
      });
    });

    socket.on("movePawn", (pawnId, boardIndex) => {
      // Récupérer le pion (le Group pivot) via son id
      const pawn = pawnsRef.current.find(p => p.userData.id === pawnId);
      if (!pawn) {
        console.warn("Pion introuvable pour leaveBase :", pawnId);
        return;
      }

      // Récupérer la position sur le plateau
      const boardPos = BOARD_POSITIONS[boardIndex];
      if (!boardPos) {
        console.warn("BOARD_POSITIONS introuvable pour l'index :", boardIndex);
        return;
      }

      const [x, z] = boardPos;

      // Déplacer le pivot du pion à cette case
      pawn.position.set(x, 0, z);

      // ✅ Après le déplacement : reset visuel de TOUS les pions
      pawnsRef.current.forEach(p => {
        p.traverse(obj => {
          if (!obj.isMesh) return;

          // enlever highlight
          if (obj.material.emissive) {
            obj.material.emissive.set(0x000000);
          }

          obj.material.opacity = 1;
          obj.material.transparent = false;

          // remettre la couleur du joueur
          obj.material.color.set(p.userData.color);
        });
      });

      // vider la liste locale des pions jouables
      movablePawnsRef.current = [];
    });

    socket.on("backToBase", (pawnId) => {
      // Récupérer le pion via son id
      const pawn = pawnsRef.current.find(p => p.userData.id === pawnId);
      if (!pawn) {
        console.warn("Pion introuvable pour backToBase :", pawnId);
        return;
      }

      const { baseX, baseZ, color } = pawn.userData;
      if (baseX === undefined || baseZ === undefined) {
        console.warn("Position de base non définie pour le pion :", pawnId);
        return;
      }

      // Remettre le pion à sa position de base
      pawn.position.set(baseX, 0, baseZ);

      // Reset visuel de tous les pions (comme dans movePawn)
      pawnsRef.current.forEach(p => {
        p.traverse(obj => {
          if (!obj.isMesh) return;

          if (obj.material.emissive) {
            obj.material.emissive.set(0x000000);
          }

          obj.material.opacity = 1;
          obj.material.transparent = false;

          obj.material.color.set(p.userData.color);
        });
      });

      // Vider la liste locale des pions jouables
      movablePawnsRef.current = [];
    });


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

          createPion( 8,  8, "#ff0100", 'I'),
          createPion( 12,  8, "#ff0100", 'J'),
          createPion( 8,  12, "#ff0100", 'K'),
          createPion( 12,  12, "#ff0100", 'L'),

          createPion( 8, -8, "#57cbff", 'E'),
          createPion( 12, -8, "#57cbff", 'F'),
          createPion( 8, -12, "#57cbff", 'G'),
          createPion( 12, -12, "#57cbff", 'H'),

          createPion(-8,  8, "#29db00", 'M'),
          createPion(-12,  8, "#29db00", 'N'),
          createPion(-8,  12, "#29db00", 'O'),
          createPion(-12,  12, "#29db00", 'P'),

        ];

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