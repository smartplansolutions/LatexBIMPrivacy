import * as OBIM from './main.js'
import * as families from './families.js'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

export function create_buildings_from_json(data,view_name="3D")
{

  
  const wall_material = new THREE.MeshPhongMaterial({name:"concrete", color: 0xa0a0a0,transparent:true,opacity:1,});
  const floor_material = new THREE.MeshPhongMaterial({name:"concrete", color: 0xdfdfdf,transparent:true,opacity:1,});
  const frame_material=new THREE.MeshPhongMaterial({name:"wood", color: 0xaa7777,transparent:true,opacity:1});
  const handle_material=new THREE.MeshPhongMaterial({name:"metal", color: 0xaaaaaa,transparent:true,opacity:1});
  const glass_material=new THREE.MeshPhongMaterial({name:"glass", color: 0x87CEEB,transparent:true,opacity:.7});


  const wall_family=[[wall_material,.2]]
  const floor_family=[[wall_material,.4]]


  const df=families.simple_door_family(1,2.5,.3,frame_material,handle_material)
  
  const env1=new OBIM.BuiltEnvironment("Environment1",OBIM.renderer)
  //***********set view names********************/
  const view = data.views.find(v => v.name === view_name);
    
  if (view) {
      // Set camera type
      const cameraType = view.cameraType;
      if (cameraType === "perspective") {
        env1.camera.position.set(...view.cameraPosition);
        env1.camera.lookAt(...view.cameraLookAt);
      } else if (cameraType && cameraType === "orthographic") {
          // Set up orthographic camera
          const aspect = window.innerWidth / window.innerHeight;
          const d = 10; // adjust as needed
          env1.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
          const target = new THREE.Vector3(0, 0, 0); // Set this to any point you want the camera to look at
          env1.camera.lookAt(...view.cameraLookAt);
          env1.camera.position.set(...view.cameraPosition);
      }
      console.log(`Camera set for view: ${view.name}`);
  } else {
      console.error(`View with name "${viewName}" not found.`);
  }

  data.buildings.forEach(building => {
    const bld = new OBIM.BuiltObject(env1, building.name);
    //***********************
    // creating building by envelope
    // This is just for fast creation of building envelopes and its related windows 
    if(building.xCoords && building.zCoords && building.levels)
    {let Xs=building.xCoords
    let Zs=building.zCoords
    let ls=building.levels
    let wall;

    building.levels.forEach((level, i) => {
            new OBIM.FLOOR(bld, building.xCoords, building.zCoords, level, floor_family);
            console.log("creating and OBIM floor")
            if(i!=0)
            {for(let j=0;j<Xs.length;j++)
              {
                wall=new OBIM.WALL(bld,[Xs[j],ls[i-1],Zs[j]],[Xs.at(j-1),ls[i],Zs.at(j-1)],wall_family)

                if (building.windows)
                {
                  building.windows.forEach(window => {
                    if(window.side_index==j)
                    {
                      const width=window.width;
                      const height=window.height;
                      const frame_depth=.2;
                      const glass_depth=.1
                      const frameThickness=.2;
                      const wf=families.simple_window_family(width,height,frame_depth,glass_depth,frameThickness,frame_material,glass_material)
                      const w=new OBIM.WINDOW(wall,wf,window.rel_position[0],window.rel_position[1])
                    }
                  })   
                }
              }
            }
        })}
  //**************************
  //creating building by walls
  //this is the standard way of creating buildings for which we should
  //specify walls and floors separately 
  //then on the walls we can add windows or doors
  // write now only walls and doors are implemented
  if (building.walls && building.walls.length > 0) {
  building.walls.forEach(wall => {
      const xzCoords = wall.xzCoordinates;
      const levels = wall.levels; // Levels for this wall
      
      // Create the wall for each level specified
      levels.forEach((level,i) => {
          // Create wall at the specified coordinates and level
          if(i>0)
          {const wallObject = new OBIM.WALL(bld, [xzCoords[0][0], levels[i-1], xzCoords[0][1]], 
                                            [xzCoords[1][0], level, xzCoords[1][1]], 
                                            wall_family);

          // Check for doors in the wall
          if (wall.doors && wall.doors.length > 0) {
              wall.doors.forEach(door => {
                  // Create door at the specified relative position
                  const relPosition = door.rel_position;
                  const doorObject = new OBIM.DOOR(wallObject, df, relPosition);
                  console.log(`Door added at relative position: ${JSON.stringify(relPosition)}`);
              });
          }}
      });
  });
}
})
set_view(env1,data,view_name)
return env1
}
export function set_view(env,data,view_name)
{
    const view = data.views.find(v => v.name === view_name);
    env.children.forEach(element => {
        let shouldHide = false; // Flag to determine if the element should be hidden

        // Check each hide rule in the view
        view.hideRule.forEach(hideRule => {
            // Evaluate the condition using eval

            if (eval(hideRule.condition)) {
                    shouldHide = true; }
        });

        // Show or hide the element based on the flag
        element.visible = !shouldHide; // Show the element if it should not be hidden
        console.log(`${element.name} visibility set to ${element.visible}`);
    });
}