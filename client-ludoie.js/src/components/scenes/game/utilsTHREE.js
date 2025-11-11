export function fitRendererToCanvas(renderer, camera, canvas) {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export function cloneWithUniqueMaterials(object) {
  const clone = object.clone(true);
  clone.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => m.clone());
      } else {
        child.material = child.material.clone();
      }
    }
  });
  return clone;
}

export function tintObject(object, color) {
  object.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.color?.set(color));
      } else {
        child.material.color?.set(color);
      }
    }
  });
}