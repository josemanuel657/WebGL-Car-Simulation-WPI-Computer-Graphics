let viewMatrix = mat4();
let cameraAngle = 0.0;

/**
 * creates a camera matrix that rotates around the center of a roundabout depending on "camera angle".
 * @returns {[]}
 */
function getCameraMatrix1() {
    let distance = 13;
    let eye = vec3(Math.cos(cameraAngle) * distance , 10 + 3*Math.cos(cameraAngle), Math.sin(cameraAngle) * distance);
    let at = vec3(0.0, 2.0, 0.0); // Center of the virtual space
    let up = vec3(0.0, 1.0, 0.0);

    return lookAt(eye, at, up);
}

/**
 * creates a camera matrix that simulates the view inside the car by:
 * - following the position of the car
 * - facing the position of the bunny
 * @returns {[]}
 */
function getCameraMatrix2(){
    let eye = vec3(carPoint[0], carPoint[1], carPoint[2]);
    let at = vec3(bunnyPoint[0], bunnyPoint[1], bunnyPoint[2]);
    let up = vec3(0,1,0);

    return lookAt(eye, at, up);
}