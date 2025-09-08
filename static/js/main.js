//we will use raycasting as an efficient way of identifying weather a point is visible but surroundings

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/PointerLockControls.js';

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//*********************************************/
//******************OBIMCLASSES****************/
//*********************************************/
export class BuiltEnvironment extends THREE.Scene
{
  constructor(name,renderer)
  {
    super()
    this.name=name;
    this.BuiltObjects=[];
    this.background = new THREE.Color( 0xffffff );
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.setZ(30);
    this.camera.position.setY(10);
    this.camera.position.setX(10);
    this.renderer=renderer;
    renderer.render(this,this.camera);

    const amblight=new THREE.AmbientLight(0xffffff,1);
    this.add(amblight);
    const light = new THREE.DirectionalLight(0xffffff, .2);
    light.position.set(-20, 30, 50);
    this.add(light);

    

    
    //add gridhelper
    const gh=new THREE.GridHelper(200,50)
    this.gh=gh;
    this.add(gh);
    
    //add ground plane
    const planeGeometry=new THREE.PlaneGeometry(60,60);
    const planeMaterial=new THREE.MeshBasicMaterial({color:0xc3b091,side:THREE.DoubleSide});
    const plane=new THREE.Mesh(planeGeometry,planeMaterial)
    plane.rotation.x=-.5*Math.PI;
    //this.add(plane);
    
    //add ax helper
    const axesHelper = new THREE.AxesHelper( 5 );
    //this.add( axesHelper );
 
    // Bind the animate function to the correct context
    // Initialize controls
    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
    this.pointerLockControls = new PointerLockControls(this.camera, document.body);
    let isPointerLocked=false;
    // Add an event listener for Pointer Lock
    document.addEventListener('dblclick', () => {
      if (isPointerLocked) {
          this.pointerLockControls.unlock();
          
      } else {
          this.pointerLockControls.lock();
      }
      isPointerLocked = !isPointerLocked;
  });

    // Key press for moving the camera (WASD)
    this.moveSpeed = 0.1;
    this.keys = {};

    document.addEventListener('keydown', (event) => {
        this.keys[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
        this.keys[event.code] = false;
    });

    this.animate = this.animate.bind(this);
    this.animate();
    
    // Add event listener for saving views
    //document.getElementById('saveView').addEventListener('click', () => this.saveView());
     
    }
    animate() {
      requestAnimationFrame(this.animate);
  
      // Move the camera based on WASD input
      if (this.pointerLockControls.isLocked) {
          const direction = new THREE.Vector3();
          this.camera.getWorldDirection(direction);
  
          if (this.keys['KeyW']) {
              this.camera.position.addScaledVector(direction, this.moveSpeed);
          }
          if (this.keys['KeyS']) {
              this.camera.position.addScaledVector(direction, -this.moveSpeed);
          }
          if (this.keys['KeyA']) {
              const sideways = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0));
              this.camera.position.addScaledVector(sideways, -this.moveSpeed);
          }
          if (this.keys['KeyD']) {
              const sideways = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0));
              this.camera.position.addScaledVector(sideways, this.moveSpeed);
          }
  
      } else {
          // Update orbit controls only when not locked
          this.orbitControls.update();
      }
  
      renderer.render(this, this.camera);
  }
    saveView()
    {
    const view = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    };

  const savedViewsContainer = document.getElementById('savedViews');
  const viewElement = document.createElement('div');
  viewElement.className = 'saved-view';
  viewElement.innerText = `View (${view.x.toFixed(1)}, ${view.y.toFixed(1)}, ${view.z.toFixed(1)})`;
  viewElement.addEventListener('click', () => this.loadView(view));
  savedViewsContainer.appendChild(viewElement);
}

loadView(view) {
  this.camera.position.set(view.x, view.y, view.z);
}

}

export class BuiltObject{
  constructor(env,name)
  {
    this.env=env;
    this.name=name;
    this.windows=[];
    this.walls=[];
    this.doors=[];
    this.floors=[];
    this.furniture=[];
    this.otherobjects=[];
  }
  add(element)
  {
    this.env.add(element)
    console.log("The element is added to the environment")
    if(element instanceof WALL)
    {
      console.log("Wall is pushed to the walls")
      this.walls.push(element);
    }
    if(element instanceof WINDOW)
      {
        this.windows.push(element);
      }
    if(element instanceof FLOOR)
        {
          this.floors.push(element);
        }
        this.env.updateMatrixWorld()
  }
  
}

export class FAMILY extends THREE.Object3D
{
    /**
   * Represents a family of BIM elements in a 3D scene.
   * This class can include multiple meshes and a bounding box.
   *
   * @param {Array} meshlist - An array of meshes that belong to this family.
   * @param {number} width - The width of the bounding box.
   * @param {number} height - The height of the bounding box.
   * @param {number} depth - The depth of the bounding box.
   */
  constructor(meshlist,width,height,depth)
  {
    super()
    this.meshlist=meshlist;
    for(let i=0;i<meshlist.length;i++)
    {
      this.add(meshlist[i])
    }
    this.width=width;
    this.height=height;
    this.depth=depth;
  }
  add_meshlist(meshlist)
  {
    for(let i=0;i<meshlist.length;i++)
      {
        this.add(meshlist[i])
      }
  }
  update_meshlist(meshlist)
  {
    while (this.children.length)
      {
          this.remove(this.children[0]);
      }
    this.add_meshlist(meshlist)
  }
}

export class WALL extends FAMILY{
  /**
   * Represents a wall in a 3D OBIMBUILTOBJECT.
   * This class extends OBIMFAMILY and includes additional properties and methods specific to walls.
   *
   * @param {Object} built_object - The built_object to which this wall belongs.
   * @param {Array} spoint - The starting point of the wall [x, y, z].
   * @param {Array} epoint - The ending point of the wall [x, y, z].
   * @param {Array} material_depth_list - A list of materials and their respective depths.
   */
  constructor(built_object,spoint,epoint,material_depth_list){
    let depth=0;
    for(let i=0;i<material_depth_list.length;i++)
      {
        depth+=material_depth_list[i][1]
      }
    const length=((epoint[0]-spoint[0])**2+(epoint[2]-spoint[2])**2)**.5; //length of the wall
    const height=epoint[1]-spoint[1]
    super([],length,height,depth)
    this.spoint=spoint;
    this.epoint=epoint;
    this.material_depth_list=material_depth_list;
    this.shape=this.create_shape(length,height)
    let meshlist=this.create_mesh_list(this.shape,material_depth_list)
    super.add_meshlist(meshlist)
    this.position.x=spoint[0];
    this.position.y=spoint[1];
    this.position.z=spoint[2];
    const xl=epoint[0]-spoint[0];
    const zl=epoint[2]-spoint[2];
    this.alpha=Math.atan(zl/xl); //rotaion degree of the wall from the y axis
    
    console.log("new wall")
    if(xl==0){
      this.alpha=(Math.PI+this.alpha)
    }

    else if(xl<0)
    {
        this.alpha=(Math.PI-this.alpha)
    }
    else{
      this.alpha=(2*Math.PI-this.alpha)
    }
    this.rotateY(this.alpha)
    
    this.windows=[]
    this.built_object=built_object;
    this.built_object.add(this);
  }
  create_shape(width,height)
  {
    const x_lower=0;
    const x_upper=width;
    const l1=0;
    const l2=height;
    const wallpoints=[
      new THREE.Vector3(x_lower,l1,0),
      new THREE.Vector3(x_upper,l1,0),
      new THREE.Vector3(x_upper,l2,0),
      new THREE.Vector3(x_lower,l2,0)
    ];
    return new THREE.Shape().setFromPoints(wallpoints)
  }
  create_mesh_list(shape,material_depth_list){
    let meshlist=[]
    let depth_till_now=0
    for(let i=0;i<material_depth_list.length;i++)
    {
      let depth=material_depth_list[i][1]
      let material=material_depth_list[i][0]
      let extrudeSettings = {
      depth: depth, // Depth of extrusion
      bevelEnabled: false, // Disable bevel
      };
      let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      let mesh = new THREE.Mesh(geometry, material);
      
      depth_till_now+=depth;
      mesh.position.z=-depth_till_now;
      meshlist.push(mesh)
    }
    return(meshlist)
  }
  
  add_hole(hole_Vertices)
  {
    this.shape.holes.push(hole_Vertices)
    const meshlist=this.create_mesh_list(this.shape,this.material_depth_list)
    this.update_meshlist(meshlist)
  }
  add_element(element,path)
  {
    this.add_hole(path)
    if(element.type==WINDOW){
    this.windows.push(element)}
    this.built_object.add(element)
  }
}  

export class FLOOR extends FAMILY{
  /**
   * Represents a wall in a 3D structure.
   * This class extends OBIMFAMILY and includes additional properties and methods specific to walls.
   *
   * @param {Object} BuiltObject - The BuiltObject to which this wall belongs.
   * @param {Array} X - x values of the floor shape.
   * @param {Array} Z - z values of the floor shape.
   * @param{int} Y- the height of the floor.
   * @param {Array} material_depth_list - A list of materials and their respective depths.
   */
    constructor(built_object,X,Z,y,material_depth_list){
      let depth=0;
      for(let i=0;i<material_depth_list.length;i++)
        {
          depth+=material_depth_list[i][1]
        }
      let length=Math.max(X)-Math.min(X)
      let width=Math.max(Z)-Math.min(Z)
      super([],length,width,depth)
      this.material_depth_list=material_depth_list;
    
      const floorpoints = [];
      for (let i = 0; i < X.length; i++) {
          floorpoints.push(new THREE.Vector3(X[i], Z[i], 0));
      }
      this.shape_points=floorpoints;
      this.level=y;
      this.shape=new THREE.Shape().setFromPoints(floorpoints)
      let depth_till_now=0
      let mesh_list=[]
      for(let i=0;i<material_depth_list.length;i++)
      {
        let mat_depth=material_depth_list[i][1]
        let material=material_depth_list[i][0]
        let extrudeSettings = {
        depth: mat_depth, // Depth of extrusion
        bevelEnabled: false, // Disable bevel
        };
        let geometry = new THREE.ExtrudeGeometry(this.shape, extrudeSettings);
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        let mesh = new THREE.Mesh(geometry, material);
        
      //   const edges = new THREE.EdgesGeometry(this.geometry);
      //   const material1 = new THREE.LineBasicMaterial({ color: 0x0f0f0f});
      //   const line = new THREE.LineSegments(edges, material1);
      //   mesh.attach(line);
        mesh.rotation.x=(Math.PI/2);
        mesh.position.y=y-depth_till_now;
        depth_till_now+=mat_depth;
        mesh_list.push(mesh)
      }
      super.add_meshlist(mesh_list)
      this.built_object=built_object
      built_object.add(this)
    }
}
    
export class ELEMENT extends FAMILY
{
  constructor(elementfamily)
  {
    let newmeshlist=[]
    for(let i=0;i<elementfamily.meshlist.length;i++)
      {
        console.log("a new mesh is added")
        newmeshlist.push(elementfamily.meshlist[i].clone())
      }
    super(newmeshlist,elementfamily.width,elementfamily.height,elementfamily.depth)
  }
  set_position(x,y,z)
  {
    this.position.x=x;
    this.position.y=y;
    this.position.z=z;
  }
  set_rotation(x,y,z)
  {
    this.rotateX(x)
    this.rotateY(y)
    this.rotateZ(z)
  }
}

export class WINDOW extends ELEMENT{
  constructor(wall, windowfamily,relative_x,okabe) {
      super(windowfamily)
      this.wall=wall;
      this.relative_x=relative_x;
      this.okabe=okabe;
      let x=relative_x;
      let y=okabe;
      const path = new THREE.Path();
      path.moveTo(x, y);
      path.lineTo(x + this.width, y); // Top-right corner
      path.lineTo(x + this.width, y + this.height); // Bottom-right corner
      path.lineTo(x, y + this.height); // Bottom-left corner
      path.lineTo(x, y); // Back to the starting point
      path.closePath();
      this.set_position(wall.position.x+relative_x*Math.cos(wall.alpha),wall.position.y+okabe
                  ,wall.position.z-relative_x*Math.sin(wall.alpha))
      this.set_rotation(0,wall.alpha,0)
      wall.add_element(this,path)
    }
}

export class DOOR extends ELEMENT{
  constructor(wall, windowfamily,relative_x) {
      super(windowfamily)
      this.wall=wall;
      this.relative_x=relative_x;
      this.okabe=0;
      let x=relative_x;
      let y=this.okabe;
      const path = new THREE.Path();
      path.moveTo(x, y);
      path.lineTo(x + this.width, y); // Top-right corner
      path.lineTo(x + this.width, y + this.height); // Bottom-right corner
      path.lineTo(x, y + this.height); // Bottom-left corner
      path.lineTo(x, y); // Back to the starting point
      path.closePath();
      this.set_position(wall.position.x+relative_x*Math.cos(wall.alpha),wall.position.y+this.okabe
                  ,wall.position.z-relative_x*Math.sin(wall.alpha))
      this.set_rotation(0,wall.alpha,0)
      wall.add_element(this,path)
    }
}

