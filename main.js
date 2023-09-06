// webgl variables
let canvas;
let gl;
let program;

// vertices, normals, and textures
let vertices = [];
let normals = [];

// flags
let cameraKeyDown = false;
let carKeyDown = false;
let cameraWithCar = false;
let skyBoxActive = false;
let reflections = false;
let refractions = false;
let lightOn = true;
let applyShadow = false;

function main() {
    initWebgl();
    initSkyTexture();
    render();
    document.addEventListener("keydown", handleKeyDown);
}


function initWebgl() {
    canvas = document.getElementById('webgl');
    gl = WebGLUtils.setupWebGL(canvas, undefined);
    if (!gl) {console.log('Failed to get the rendering context for WebGL');}

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK);

    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);
}

function render(){
    clearCanvas();

    if(!cameraWithCar){viewMatrix = getCameraMatrix1(); setUpProjectionMatrix(30);}
    if(cameraWithCar){viewMatrix = getCameraMatrix2(); setUpProjectionMatrix(80);}

    if(skyBoxActive) {drawSky();}

    drawObjects(false);
    if(applyShadow && lightOn){drawObjects(true); }

    if (cameraKeyDown){ cameraAngle -= 0.025;}
    if (carKeyDown){ carAngle += 1.5}

    requestAnimationFrame(render);
}

function clearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function setUpProjectionMatrix(fov) {
    let projectionMatrix = perspective(fov,1.0,0.1,1000);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projectionMatrix'), false, flatten(projectionMatrix));
}

function reset(){
    vertices = [];
    normals = [];
    texCoords = [];
    materials = [];
}

function handleKeyDown(event){
    switch(event.key.toLowerCase()){
        case "l": lightOn = !lightOn; break;
        case "s": applyShadow = !applyShadow; break;
        case "c": cameraKeyDown = !cameraKeyDown; break;
        case "m": carKeyDown = !carKeyDown; break;
        case "d": cameraWithCar = !cameraWithCar; break;
        case "e": skyBoxActive = !skyBoxActive; break;
        case "r": reflections = !reflections; break;
        case "f": refractions = !refractions; break;
    }
}
