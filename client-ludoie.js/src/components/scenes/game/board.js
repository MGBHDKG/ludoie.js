import * as THREE from "three";

export function drawBoard() {
    const board = new THREE.Group();

    const loader = new THREE.TextureLoader();
    const boardTex = loader.load('plateau.png', (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;

        tex.needsUpdate = true;
    });

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshBasicMaterial({ map: boardTex })
    );

    floor.rotation.x = -Math.PI / 2;
    board.add(floor);

    return board;
}