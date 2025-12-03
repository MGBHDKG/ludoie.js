import { BOARD_POSITIONS, END_BASE_POSITIONS } from "./board";

export function drawMovablePawns(pawnsRef, movablePawns){
    pawnsRef.current.forEach(pawn => {
        const isMovable = movablePawns.includes(pawn.userData.id);

        pawn.traverse(obj => {
            if (!obj.isMesh) return;

            // enlever un éventuel highlight précédent
            if (obj.material.emissive) {
            obj.material.emissive.set(0x000000);
            }

            if (isMovable) {
                // feedback visuel : par ex. rose
                obj.material.color.set("#ffffff");
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
}

export function movePawn(pawnId, boardIndex, pawnsRef){
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
}

export function movePawnToBase(pawnId, pawnsRef){
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
}

export function movePawnToEndCase(pawnId, playerIndex, endCaseIndex, pawnsRef){
    // Récupérer le pion via son id
      const pawn = pawnsRef.current.find(p => p.userData.id === pawnId);
      if (!pawn) {
        console.warn("Pion introuvable pour movePawnToEndCase :", pawnId);
        return;
      }

      // Récupérer la position de la case de fin pour ce joueur
      const playerEndCases = END_BASE_POSITIONS[playerIndex];
      if (!playerEndCases) {
        console.warn("END_BASE_POSITIONS introuvable pour le joueur :", playerIndex);
        return;
      }

      const endPos = playerEndCases[endCaseIndex];
      if (!endPos) {
        console.warn("END_BASE_POSITIONS introuvable pour l'index de fin :", endCaseIndex);
        return;
      }

      const [x, z] = endPos;

      // Déplacer le pion sur la case de fin
      pawn.position.set(x, 0, z);
}

export function unhighlightMovablePawns(pawnsRef, movablePawnsRef){
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

    movablePawnsRef.current = [];
}