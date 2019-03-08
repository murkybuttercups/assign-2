window.onload = init;

function init() {
	
	// document.querySelector('a-box').addEventListener('click', function (evt) {
 //  		console.log('This 2D element was clicked!');
	// });

	// TOOD change window inner height and window inner width to the canvas heights.
	// TODO javascript for checking width of the window and set the canvas to that.

	var canvas = document.getElementById("canvas");

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0.0, 0.0, 10.0);
	
	var renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	renderer.setSize(window.innerWidth, window.innerHeight);

	var light = new THREE.HemisphereLight(0xffffff, 0x080820, 20);
	light.position.set(0, 1, 0);
	scene.add(light);

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	mouse.x = 1000000;
	mouse.y = 1000000;

	function onMouseMove(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 -1;
		mouse.y = -((event.clientY / window.innerHeight) * 2 -1);
	}

	var loader = new THREE.GLTFLoader();
	// Load a glTF resource
	loader.load(
		// resource URL
		'model/knife.gltf',
		// called when the resource is loaded
		function ( gltf ) {

			scene.add( gltf.scene );
			render();

		},
		// called while loading is progressing
		function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened' );

		}
	);

	function Render() {
		console.log(mouse.x);
		console.log(mouse.y);
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);

		for (var i = 0; i < intersects.length; i++)
		{
			intersects[i].object.material.color.set(0xff0000);
		}

		renderer.render(scene, camera);
		requestAnimationFrame(Render);
	}


	window.addEventListener('mousemove', onMouseMove, false);

	Render();
}