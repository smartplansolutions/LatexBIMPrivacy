import * as THREE from './three.module.js';
import * as OBIM from './main.js';
import * as families from './families.js';

// Mapping of hide rule condition strings to evaluator functions.
// This avoids the use of `eval`, which is blocked by strict
// Content Security Policies.  Each key should match the exact
// condition string found in the JSON configuration.  The
// corresponding value is a function that receives an element and
// returns `true` if the element should be hidden.
const CONDITION_EVALUATORS = {
  'element instanceof OBIM.WALL && element.spoint[2]>7 && element.epoint[2]>7':
    element => element instanceof OBIM.WALL &&
               element.spoint[2] > 7 && element.epoint[2] > 7,
  'element instanceof OBIM.FLOOR':
    element => element instanceof OBIM.FLOOR,
  '(element instanceof OBIM.FLOOR ||  element instanceof OBIM.WALL ||  element instanceof OBIM.WINDOW ||  element instanceof OBIM.DOOR)  && new THREE.Box3().setFromObject(element).min.y>3':
    element => (
      (element instanceof OBIM.FLOOR ||
       element instanceof OBIM.WALL ||
       element instanceof OBIM.WINDOW ||
       element instanceof OBIM.DOOR) &&
      new THREE.Box3().setFromObject(element).min.y > 3
    ),
  'element instanceof OBIM.FLOOR && element.level<5':
    element => element instanceof OBIM.FLOOR && element.level < 5,
};

/**
 * Create an OBIM environment from a JSON description of buildings.
 *
 * The previous version of this file executed top level code and ended with a
 * `return` statement.  When used as an ES module this caused the browser to
 * throw `Uncaught SyntaxError: Illegal return statement`.  The code is now
 * wrapped inside an exported function so it can be imported safely.
 *
 * @param {Object} data       Parsed JSON describing the scene.
 * @param {THREE.WebGLRenderer} renderer  Renderer used for the environment.
 * @param {string} view_name  Name of the view to activate once built.
 * @returns {OBIM.BuiltEnvironment} The populated environment.
 */
export function create_buildings_from_json(data, renderer, view_name) {
  // create the environment
  const env1 = new OBIM.BuiltEnvironment(
    data?.environment?.name || 'Environment',
    renderer,
  );

  // base materials
  const wall_material = new THREE.MeshPhongMaterial({
    name: 'concrete',
    color: 0xa0a0a0,
    transparent: true,
    opacity: 1,
  });
  const floor_material = new THREE.MeshPhongMaterial({
    name: 'concrete',
    color: 0xdfdfdf,
    transparent: true,
    opacity: 1,
  });
  const frame_material = new THREE.MeshPhongMaterial({
    name: 'wood',
    color: 0xaa7777,
    transparent: true,
    opacity: 1,
  });
  const handle_material = new THREE.MeshPhongMaterial({
    name: 'metal',
    color: 0xaaaaaa,
    transparent: true,
    opacity: 1,
  });
  const glass_material = new THREE.MeshPhongMaterial({
    name: 'glass',
    color: 0x0000ff,
    transparent: true,
    opacity: 0.7,
  });

  const wall_family = [[wall_material, 0.2]];
  const floor_family = [[wall_material, 0.4]];

  // default door family used for door creation
  const df = families.simple_door_family(1, 2, 0.2, frame_material, handle_material);

  // build each building defined in the JSON
  data.buildings.forEach(building => {
    const bld = new OBIM.BuiltObject(env1, building.name);

    // fast creation by envelope
    if (building.xCoords && building.zCoords && building.levels) {
      const Xs = building.xCoords;
      const Zs = building.zCoords;
      const ls = building.levels;
      let wall;

      building.levels.forEach((level, i) => {
        new OBIM.FLOOR(bld, building.xCoords, building.zCoords, level, floor_family);
        if (i !== 0) {
          for (let j = 0; j < Xs.length; j++) {
            wall = new OBIM.WALL(
              bld,
              [Xs[j], ls[i - 1], Zs[j]],
              [Xs.at(j - 1), ls[i], Zs.at(j - 1)],
              wall_family,
            );

            if (building.windows) {
              building.windows.forEach(window => {
                if (window.side_index === j) {
                  const width = window.width;
                  const height = window.height;
                  const frame_depth = 0.2;
                  const glass_depth = 0.4;
                  const frameThickness = 0.2;
                  const wf = families.simple_window_family(
                    width,
                    height,
                    frame_depth,
                    glass_depth,
                    frameThickness,
                    frame_material,
                    glass_material,
                  );
                  new OBIM.WINDOW(wall, wf, window.rel_position[0], window.rel_position[1]);
                }
              });
            }
          }
        }
      });
    }

    // detailed creation using walls and doors
    if (building.walls && building.walls.length > 0) {
      building.walls.forEach(wall => {
        const xzCoords = wall.xzCoords;
        const levels = wall.levels;

        levels.forEach((level, i) => {
          if (i > 0) {
            const wallObject = new OBIM.WALL(
              bld,
              [xzCoords[0][0], levels[i - 1], xzCoords[0][1]],
              [xzCoords[1][0], level, xzCoords[1][1]],
              wall_family,
            );

            if (wall.doors && wall.doors.length > 0) {
              wall.doors.forEach(door => {
                const relPosition = door.rel_position;
                new OBIM.DOOR(wallObject, df, relPosition);
              });
            }
          }
        });
      });
    }
  });

  set_view(env1, data, view_name);
  return env1;
}

/**
 * Apply a view configuration to the provided environment.
 */
export function set_view(env, data, view_name) {
  const view = data.views.find(v => v.name === view_name);

  if (view) {
    const cameraType = view.cameraType;
    if (cameraType === 'perspective') {
      env.camera.position.set(...view.cameraPosition);
      env.camera.lookAt(...view.cameraLookAt);
    } else if (cameraType && cameraType === 'orthographic') {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const frustumSize = view.frustumSize;

      env.camera = new THREE.OrthographicCamera(
        (frustumSize * aspectRatio) / -2,
        (frustumSize * aspectRatio) / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000,
      );

      env.camera.position.set(...view.cameraPosition);
      env.camera.lookAt(...view.cameraLookAt);
    }
    console.log(`Camera set for view: ${view.name}`);
  } else {
    console.error(`View with name "${view_name}" not found.`);
  }

  if (view && view.hideRule) {
    env.children.forEach(element => {
      let shouldHide = false;

      view.hideRule.forEach(hideRule => {
        const condition = hideRule.condition.trim();
        const evaluator = CONDITION_EVALUATORS[condition];
        if (evaluator) {
          if (evaluator(element)) {
            shouldHide = true;
          }
        } else {
          console.warn(`Unknown hide rule condition: ${condition}`);
        }
      });

      element.visible = !shouldHide;
    });
  }
}

