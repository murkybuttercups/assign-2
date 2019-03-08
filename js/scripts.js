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
		function FrontBox() {
			var geo = new THREE.BoxGeometry(3.4, 2.8, 0.5);
			var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
			mat.wireframe = true;
			var cube = new THREE.Mesh(geo, mat);
			scene.add(cube);
			
			cube.position.x = 0.11;
			cube.position.y = 0.6;
			cube.position.z = 1;
		}
		function BackBox() {
			var geo = new THREE.BoxGeometry(3.4, 2.8, 0.5);
			var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
			mat.wireframe = true;
			var cube = new THREE.Mesh(geo, mat);
			scene.add(cube);

			cube.position.x = 0.2;
			cube.position.y = 0.6;
			cube.position.z = -0.0;
		}

		function LeftBox() {
			var geo = new THREE.BoxGeometry(0.5, 2.8, 2.5);
			var mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
			mat.wireframe = true;
			var cube = new THREE.Mesh(geo, mat);
			scene.add(cube);

			cube.position.x = -1.84;
			cube.position.y = 0.6;
			cube.position.z = 0;
		}

		function RightBox() {
			var geo = new THREE.BoxGeometry(0.5, 2.8, 2.5);
			var mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
			mat.wireframe = true;
			var cube = new THREE.Mesh(geo, mat);
			scene.add(cube);

			cube.position.x = 2.05;
			cube.position.y = 0.6;
			cube.position.z = 0;
		}

		function BottomBox() {
			var geo = new THREE.BoxGeometry(4.2, 0.8, 2.5);
			var mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
			mat.wireframe = true;
			var cube = new THREE.Mesh(geo, mat);
			scene.add(cube);

			cube.position.x = 0;
			cube.position.y = -1.2;
			cube.position.z = 0;
		}

		FrontBox();
		BackBox();
		LeftBox();
		RightBox();
		BottomBox();
	}

	function Render() {
		// console.log(mouse.x);
		// console.log(mouse.y);

		// Finds the first intersected hitbox in the scene from the mouse normal.
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0)
			intersects[0].object.material.color.set(0xff0000);
		
		// TODO add clicking events for areas that the mouse is raycasted to. 
		// TODO add events for when the area is moused over? if possible
		// TOOD add ID clicks to fill in information of the area on the HTML
			
		// TODO add rotational controls
			
		scene.rotation.y += 0.01;

		renderer.render(scene, camera);
		requestAnimationFrame(Render);
	}


	window.addEventListener('mousemove', onMouseMove, false);
}