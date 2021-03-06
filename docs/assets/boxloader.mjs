/*

*/
const js = `
import obj from "http://192.168.0.10:3000/jcode/assets/obj.js"

// create a box
function myMesh() {
	var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
	var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var mesh = new THREE.Mesh(cubeGeometry, material);
	mesh.position.y = 2;
	mesh.castShadow = true;
	return mesh;
}
// define class
class myClass {
	constructor(group) {
		var myobj = new obj(group);
		myobj.add(new myMesh())
		return myobj;
	}
}

export default myClass;
`
function myFunc() {
  const encodedJs = encodeURIComponent(js);
  const dataUri = 'data:text/javascript;charset=utf-8,'+ encodedJs;
  return import(dataUri)
}

export default myFunc;
