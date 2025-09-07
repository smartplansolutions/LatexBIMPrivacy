//***********************************************/
//*************Generate families*****************/
//***********************************************/
import * as OBIM from './main.js'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';


export function simple_window_family(width,height,frame_depth,glass_depth,frameThickness,frame_material,glass_material)
{
    // Create a shape for the window frame (a rectangle with a hole)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    shape.lineTo(0, 0);
    // Define extrusion settings
    const frame_extrudeSettings = {
      depth: frame_depth,
      bevelEnabled: false
    };

    const glass_extrudeSettings = {
      depth: glass_depth,
      bevelEnabled: false
    };

    // Create the hole in the shape ready for glasses
    const hole = new THREE.Path();
    hole.moveTo(frameThickness, frameThickness);
    hole.lineTo(width - frameThickness, frameThickness);
    hole.lineTo(width - frameThickness, height - frameThickness);
    hole.lineTo(frameThickness, height - frameThickness);
    hole.lineTo(frameThickness, frameThickness);
    const glassshape = new THREE.Shape();
    glassshape.moveTo(frameThickness, frameThickness);
    glassshape.lineTo(width - frameThickness, frameThickness);
    glassshape.lineTo(width - frameThickness, height - frameThickness);
    glassshape.lineTo(frameThickness, height - frameThickness);
    glassshape.lineTo(frameThickness, frameThickness);

    const glass_geometry = new THREE.ExtrudeGeometry(glassshape, glass_extrudeSettings);
    shape.holes.push(hole);
    const glass = new THREE.Mesh(glass_geometry, glass_material);
    glass.position.z=(-frame_depth-glass_depth)/2;

    // Create an extrude geometry
    const geometry = new THREE.ExtrudeGeometry(shape, frame_extrudeSettings);

    // Create a material and a mesh
    const windowFrame = new THREE.Mesh(geometry, frame_material);
    windowFrame.position.z=-frame_depth;
    const windowfamily=new OBIM.FAMILY([windowFrame,glass],width,height,frame_depth)
    return windowfamily
  }

  export function simple_door_family(width, height, frame_depth, frame_material, handle_material) {
    // Create a shape for the door frame (a rectangle)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    shape.lineTo(0, 0);

    // Define extrusion settings
    const carving_depth=.05
    const frame_extrudeSettings = {
        depth: frame_depth-carving_depth,
        bevelEnabled: false
    };

    // Create an extrude geometry for the door frame
    const geometry = new THREE.ExtrudeGeometry(shape, frame_extrudeSettings);

    // Create a material and a mesh for the door frame
    const doorFrame = new THREE.Mesh(geometry, frame_material);
    doorFrame.position.z = -frame_depth;

    // Create a handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const handle = new THREE.Mesh(handleGeometry, handle_material);
    handle.position.set(width / 2 - 0.2, height / 2, -frame_depth / 2);

    // Create carvings (simple rectangles for demonstration)
    const carveShape = new THREE.Shape();
    carveShape.moveTo(0.2, 0.2);
    carveShape.lineTo(width - 0.2, 0.2);
    carveShape.lineTo(width - 0.2, height - 0.2);
    carveShape.lineTo(0.2, height - 0.2);
    carveShape.lineTo(0.2, 0.2);

    
    shape.holes.push(carveShape)
    //shape.push(carveShape2)
    const carveExtrudeSettings = {
        depth: carving_depth,
        bevelEnabled: false
    };
  
    const carveGeometry = new THREE.ExtrudeGeometry(shape, carveExtrudeSettings);
    const carvings1 = new THREE.Mesh(carveGeometry, frame_material);
    carvings1.position.z = -carving_depth ;

    const carvings2 = new THREE.Mesh(carveGeometry, frame_material);
    carvings2.position.z = -frame_depth-carving_depth;

    const doorFamily = new OBIM.FAMILY([doorFrame, handle, carvings1,carvings2], width, height, frame_depth);
    return doorFamily;
}
