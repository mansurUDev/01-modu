import * as THREE from "three";

/**
 * The module shell: a rounded-rectangle footprint extruded upward with a
 * small bevel on every edge. Ported line-for-line from `moduleBody()` in
 * design-system/modu-deck-3d.html.
 *
 * Do NOT swap this for drei's <RoundedBox>. The bevel is what makes the
 * body read as a machined aluminium extrusion instead of a soft plastic
 * brick — it is the single most brand-defining piece of geometry in the
 * scene (BUILD_PLAN.md T3 calls this out explicitly).
 *
 * Shape space is (x, y); the extrusion runs along +z, so the source
 * builds the footprint in (x, z) names, extrudes, then rotates -90° about
 * X to lay it flat and lifts it by the bevel thickness so the underside
 * sits exactly on y = 0.
 */
export function createModuleBodyGeometry(
  w: number,
  len: number,
  h: number,
): THREE.ExtrudeGeometry {
  const r = 0.006; // corner radius
  const b = 0.0022; // bevel thickness / size

  const s = new THREE.Shape();
  const x0 = -w / 2 + b;
  const z0 = -len / 2 + b;
  const x1 = w / 2 - b;
  const z1 = len / 2 - b;

  s.moveTo(x0 + r, z0);
  s.lineTo(x1 - r, z0);
  s.quadraticCurveTo(x1, z0, x1, z0 + r);
  s.lineTo(x1, z1 - r);
  s.quadraticCurveTo(x1, z1, x1 - r, z1);
  s.lineTo(x0 + r, z1);
  s.quadraticCurveTo(x0, z1, x0, z1 - r);
  s.lineTo(x0, z0 + r);
  s.quadraticCurveTo(x0, z0, x0 + r, z0);

  const geometry = new THREE.ExtrudeGeometry(s, {
    depth: h - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, b, 0);

  return geometry;
}
