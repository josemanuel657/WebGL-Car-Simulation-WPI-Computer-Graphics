// skyCubeVertices
const factor = 12.0;
const skyBoxVertices = [
    vec4(-0.5 * factor, -0.5 * factor, 0.5 * factor, 1.0),
    vec4(-0.5 * factor, 0.5 * factor , 0.5 * factor , 1.0),
    vec4(0.5 * factor, 0.5 * factor , 0.5 * factor, 1.0),
    vec4(0.5 * factor, -0.5 * factor, 0.5 * factor, 1.0),
    vec4(-0.5 * factor, -0.5 * factor, -0.5 * factor, 1.0),
    vec4(-0.5 * factor, 0.5 * factor, -0.5 * factor, 1.0),
    vec4(0.5 * factor, 0.5 * factor, -0.5 * factor, 1.0),
    vec4(0.5 * factor, -0.5 * factor, -0.5 * factor, 1.0)
];

// skyCubeTextureCoordinates
const minT = 0.0;
const maxT = 1.0;
const cubeTextCoords = [
    vec2(minT, minT),
    vec2(minT, maxT),
    vec2(maxT, maxT),
    vec2(maxT, minT)
];

/**
 * Asynchronously initializes the Sky Texture and sends it to the fragment shader
 */

function initSkyTexture(){
    let mips = [];

    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_posx.png", 0);
    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_negx.png", 1);
    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_posy.png", 2);
    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_negy.png", 3);
    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_posz.png", 4);
    loadImage("https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/skybox_negz.png", 5);
    waitForTexture();

    function loadImage(link, index) {
        let image = new Image();
        image.crossOrigin = "";
        image.src = link;
        image.onload = function () {mips.splice(index, 0, image);}
    }

    function waitForTexture() {
        if(mips.length >= 6) {
            configureSkyTexture();
        }
        else{requestAnimationFrame(waitForTexture);}
    }
    function configureSkyTexture() {
        let skyCubeTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);//TELL WEBGL THE ACTIVE  texture(mandatory for webgl. ONLY ONE AT A TIME UNLIKE TEXTURE):I has to be a different location
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyCubeTexture);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[0]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[1]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[2]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[3]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[4]);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, mips[5]);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.uniform1i(gl.getUniformLocation(program, "sampler1"),1);
    }
}

/**
 * Draws a background sky by creating a cube and applying the skyCube texture to it.
 */

function drawSky(){
    gl.uniform1i(gl.getUniformLocation(program, "vLoadingSkyBox"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "fLoadingSkyBox"), 1);

    gl.disable(gl.DEPTH_TEST);
    gl.cullFace(gl.FRONT);

    updateModelViewMatrix();

    createSkyBox();
    gl.activeTexture(gl.TEXTURE1);

    setVectorBuffers();
    setTextureBuffers();

    gl.drawArrays( gl.TRIANGLES, 0, 36 );

    disableTextureBuffers();

    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);

    gl.uniform1i(gl.getUniformLocation(program, "vLoadingSkyBox"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "fLoadingSkyBox"), 0);

    reset();

    function createSkyBox() {
        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(6, 5, 1, 2);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);

        function quad(a, b, c, d) {
            vertices.push(skyBoxVertices[a]);
            texCoords.push(cubeTextCoords[0]);

            vertices.push(skyBoxVertices[b]);
            texCoords.push(cubeTextCoords[1]);

            vertices.push(skyBoxVertices[c]);
            texCoords.push(cubeTextCoords[2]);

            vertices.push(skyBoxVertices[a]);
            texCoords.push(cubeTextCoords[0]);

            vertices.push(skyBoxVertices[c]);
            texCoords.push(cubeTextCoords[2]);

            vertices.push(skyBoxVertices[d]);
            texCoords.push(cubeTextCoords[3]);
        }
    }
}