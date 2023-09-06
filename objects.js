// model object
const stopSign = new Model(
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.obj",
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.mtl");

const lamp = new Model(
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.obj",
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.mtl");

const car = new Model(
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.obj",
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.mtl");

const street = new Model(
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.obj",
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.mtl");

const bunny = new Model(
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.obj",
    "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.mtl");

// model object fields
let isTextured;
let materials = [];
let texCoords = [];
let diffuseMap;
let specularMap;

// model matrix and stack
let modelMatrix = mat4();
let modelStack = [];

// lighting Variables
let lightPosition = vec4(0.0, 2.0, 5.6, 1.0 );
let lightAmbient = vec4(0.4, 0.4, 0.4, 1.0 );
let materialAmbient = vec4( 0.1, 0.1, 0.1, 1.0 );
let materialShininess = 1.0;


// Car and camera rotation variables
let carAngle = 180.0;

// Variables for the camera to follow the car
let carPoint;
let bunnyPoint;

// flags
let isSignTextureLoaded = false;

let isLoadingStreet = false;
let isLoadingCar = false;
let isLoadingBunny = false;
let isLoadingLamp = false;
let isLoadingSign = false;



/**
 * Draw the objects in the scene accumulating matrix transformations:
 * - It stores the objects of the scene  an n-ary tree graph to nest those that are dependent
 * - It traverses the graph using DFS to nest transformations.
 * - It loads, parses and draws each object.
 * @param applyShadow wether or not shadows are beign drawn in the scence
 */
function drawObjects(applyShadow) {
    function Node(object, transform) {
        this.object = object;
        this.transform = transform;
        this.children = [];
    }

    let tStopSign = new Node(stopSign, 1);
    let tStreet = new Node(street, 2);
    let tCar = new Node(car, 3);
    let tLamp = new Node(lamp, 4);
    let tBunny = new Node(bunny, 5);

    let root = tStreet;
    root.children.push(tLamp);
    tCar.children.push(tBunny);
    root.children.push(tCar);
    root.children.push(tStopSign);


    function table(num) {
        switch (num) {
            case 1:return getSignModelMatrix();
            case 2:return getStreetModelMatrix();
            case 3:return getCarModelMatrix();
            case 4:return getLampModelMatrix();
            case 5:return getBunnyModelMatrix();
        }
    }

    hierarchy(root);

    function hierarchy(node) {
        isLoadingSign = node.transform === 1;
        isLoadingStreet = node.transform === 2;
        isLoadingCar = node.transform === 3;
        isLoadingLamp = node.transform === 4;
        isLoadingBunny = node.transform === 5;

        if (applyShadow) {
            hierarchyWithShadows(node);
        } else {
            hierarchyWithoutShadows(node)
        }
    }

    function hierarchyWithoutShadows(node) {
        lightPosition = vec4(0.0, 2.0, 5.6, 1.0 );
        modelStack.push(modelMatrix);
        modelMatrix = mult(modelMatrix, table(node.transform));

        if (node.transform === 3) {
            let origin = vec4(0.2, 1.3, 1.0, 1.0);
            carPoint = mult(modelMatrix, origin);
        }
        if (node.transform === 5) {
            let origin = vec4(0.3, 0.0, 0.0, 1.0);
            bunnyPoint = mult(modelMatrix, origin);
        }
        updateModelViewMatrix();
        draw(node.object);
        node.children.forEach((node) => hierarchy(node));
        modelMatrix = modelStack.pop();
    }

    function hierarchyWithShadows(node) {
        lightPosition = vec4(4.0, 5.6, 3.6, 1.0 );
        modelStack.push(modelMatrix);
        modelMatrix = mult(modelMatrix, table(node.transform));
        if (!isLoadingStreet && !isLoadingLamp && !isLoadingBunny) {
            modelStack.push(modelMatrix);
            gl.uniform1i(gl.getUniformLocation(program, "applyShadow"), 1);
            modelMatrix = mult(modelMatrix, getShadowMatrix());
            updateModelViewMatrix();
            draw(node.object)

            gl.uniform1i(gl.getUniformLocation(program, "applyShadow"), 0);
            modelMatrix = modelStack.pop();
        }
        node.children.forEach((node) => hierarchy(node));
        modelMatrix = modelStack.pop();
    }
}

/**
 * draws and individual element by parsing it and setting up its lighting.
 * It calls multiple fragment shader flags depending on whether:
 * - the object has a texture (sing)
 * - reflections or refractions are being applied to the object (car and bunny respectively).
 * @param element
 */

function draw(element){
    parseModel(element);
    loadObject();
    reset();

    function loadObject(){
        setVectorBuffers();
        setNormalBuffers();

        if (isTextured){
            gl.uniform1i(gl.getUniformLocation(program, "applyTexture"),1);
            gl.activeTexture(gl.TEXTURE0);
            setTextureBuffers();
        } else {gl.uniform1i(gl.getUniformLocation(program, "applyTexture"),0);}


        if(reflections && isLoadingCar){gl.uniform1i(gl.getUniformLocation(program, "reflections"), 1);}
        else {gl.uniform1i(gl.getUniformLocation(program, "reflections"), 0);}

        if(refractions && isLoadingBunny){gl.uniform1i(gl.getUniformLocation(program, "refractions"), 1);}
        else {gl.uniform1i(gl.getUniformLocation(program, "refractions"), 0);}


        let mat = "none yet";

        for( let i= 0; i<vertices.length -1; i+=3){
            if(!(materials[i] === mat)){
                mat = materials[i];
                setUpLighting(mat);
            }
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }

        if (isTextured){disableTextureBuffers();}
    }
}

/**
 * parses the obj file and stores each face's:
 * - vertices in vertices[]
 * - materials in materials[]
 * - normals in normals[]
 * - texture coordinates in texCoords[]
 * if the object is textured (sing model), the texture is initialized the first time that it is parsed.
 * @param model
 */
function parseModel(model) {
    model.loadFile(model.objPath, model.objFile);
    if(model.objParsed && model.mtlParsed) {
        model.faces.forEach((face) => {
            face.faceVertices.forEach((vertex) => {
                vertices.push(vertex);
                materials.push(face.material);
            });
            face.faceNormals.forEach((normal) => {
                normals.push(normal);
            });
            face.faceTexCoords.forEach((coord) => {
                texCoords.push(vec2(coord[0],  coord[1]));
            });
        });
        diffuseMap = model.diffuseMap;
        specularMap = model.specularMap;
    }
    if (model.textured) {
        isTextured = true;
        if(!isSignTextureLoaded) {initTexture(model)}
        gl.activeTexture(gl.TEXTURE0);
    }
    isTextured = model.textured;
}

/**
 * Sets up diffuse, specular and ambient lighting when a new material is being used for some faces
 * @param material
 */

function setUpLighting(material){
    let lightDiffuse, lightSpecular, materialDiffuse, materialSpecular;

    if (lightOn){
        lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
        lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
        materialDiffuse = getMaterialValue(diffuseMap, material);
        materialSpecular = getMaterialValue(specularMap, material);
    } else {
        lightDiffuse = vec4( 0.15, 0.15, 0.15, 1.0 );
        lightSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );
        materialDiffuse = getMaterialValue(diffuseMap, material);
        materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
    }

    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);
    let ambientProduct = mult(lightAmbient, materialAmbient);

    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

    function getMaterialValue(map, targetMat){
        const iterator = map.entries();
        let element = iterator.next();
        while (!element.done){
            let mat = element.value[0];
            if (mat===targetMat){
                let matValue = element.value[1];
                return vec4(matValue[0], matValue[1], matValue[2], 1.0);
            }
            element = iterator.next();
        }
        console.log('material not found');
    }

}

/**
 * It initializes an object texture and sends it to the fragment shader saves as texture0.
 * Used for the sign texture.
 * @param model
 */

function initTexture(model) {
    isSignTextureLoaded = true;
    let textureImage = new Image();
    textureImage.crossOrigin = "";
    textureImage.src = model.imagePath;
    textureImage.onload = function () {
        configureSignalTexture(textureImage);
    }

    function configureSignalTexture(image) {
        let signalTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, signalTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.uniform1i(gl.getUniformLocation(program, "sampler0"), 0);
    }
}