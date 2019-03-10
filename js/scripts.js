window.onload = init;

function init() {
	// TOOD change window inner height and window inner width to the canvas heights.
	// TODO javascript for checking width of the window and set the canvas to that.

	var canvas = document.getElementById("canvas");

	var scene = new THREE.Scene();
	scene.position.x += 2; // Move the scene to the right.
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0.0, 0.0, 10.0);

	var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	var light = new THREE.HemisphereLight(0xffffff, 0x080820, 5);
	light.position.set(0, 1, 0);
	scene.add(light);

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	var gltfscene = null;
	var pouch = null;
	
	// Set to something the mouse pos should never reach so make sure there are no auto selected raycasts.
	mouse.x = 1000000;
	mouse.y = 1000000;

	function onMouseMove(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	}
	
	function onMouseDown(event) {
		for (var i = 0; i < scene.children.length; i++)
		{
			if (scene.children[i].name == "hitbox")
			{
				scene.children[i].selected = false;
				if (scene.children[i].hovering == true)
				{
					scene.children[i].selected = true;
				}
			}
		}	
	}

	var loader = new THREE.GLTFLoader();
	// Load a glTF resource
	loader.load(
		// resource URL
		'model/GLTF/pouch.gltf',
		// called when the resource is loaded
		function (gltf) {
			// Grab the mesh out of the scene for additional rotations
			gltfscene = gltf.scene;
			pouch = gltfscene.children[2];
			pouch.name = "pouch";
			scene.add(gltfscene);

			// Rotate the pouch so the normal faces the user
			// not perfect but pretty close.
			pouch.rotation.x = 14;
			pouch.rotation.y = 1.88;
			pouch.rotation.z = 35.52000000000168;
			// Rotate the entire scene so the pouch looks straight at the user instead of sideways.
			gltfscene.rotation.y += 5;

			ConstructHitBoxes();
			Render();

		},
		// called while loading is progressing
		function (xhr) {

			console.log((xhr.loaded / xhr.total * 100) + '% loaded');

		},
		// called when loading has errors
		function (error) {

			console.log('An error happened');

		}
	);

	// Create teh hit boxes for the hot spots on the pouch, can add stipe hitboxes for the back as well if needed
	function ConstructHitBoxes() {
		function CreateHitBox(w, h, d, x, y, z, rotx = 0.0, roty = 0.0, rotz = 0.0) {
			var geo = new THREE.BoxGeometry(w, h, d);
			var mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
			mat.transparent = true;
			mat.opacity = 0.0;
			
			var cube = new THREE.Mesh(geo, mat);
			cube.name = "hitbox";
			cube["selected"] = false;
			cube["hovering"] = true;
			scene.add(cube);
			
			
			cube.rotation.x = rotx;
			cube.rotation.y = roty;
			cube.rotation.z = rotz;
			
			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;
			
		}
		
		CreateHitBox(3.4, 3.1, 0.1, 0.11, 0.6, 1, 0.1, 0, 0.0); // front
		CreateHitBox(3.4, 2.6, 0.1, 0.2, 0.6, -0.17, 0.2, 0.0, 0.0); // back
		CreateHitBox(0.5, 3.0, 2.5, -1.84, 0.3, 0); // left
		CreateHitBox(0.5, 2.5, 2.5, 2.095, 0.80, 0); // right
		CreateHitBox(4.2, 0.4, 2.5, 0, -1.0, 0, 0.0, 0.0, 0.17); // bottom
	}

	function Render() {
		// console.log(mouse.x);
		// console.log(mouse.y);
		
		for (var i = 0; i < scene.children.length; i++)
		{
			if (scene.children[i].name == "hitbox" && scene.children[i].selected == false)
			{
				scene.children[i].material.opacity = 0.0;
				scene.children[i].hovering = false;
			}	
		}
		
		// Finds the first intersected hitbox in the scene from the mouse normal.
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0)
		{
			var interObj = intersects[0].object;
			interObj.material.opacity = 0.3;
			
			// This needs to be placed under a click event
			interObj.hovering = true;
			// interObj.selected = true;
		}
		
		// TODO add clicking events for areas that the mouse is raycasted to. 
		// TODO add events for when the area is moused over? if possible
		// TOOD add ID clicks to fill in information of the area on the HTML
			
		// TODO add rotational controls
			
		scene.rotation.y = -0.5;
		// scene.rotation.y += 0.01;

		renderer.render(scene, camera);
		requestAnimationFrame(Render);
	}


	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mousedown', onMouseDown, false);
}