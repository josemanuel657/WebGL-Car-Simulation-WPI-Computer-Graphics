function getStreetModelMatrix() {
    return rotateY(0);
}

function getCarModelMatrix(){
    let distance = 3;
    let model = rotateY(carAngle);
    model = mult(model, translate(0,0,distance));
    model = mult (model, rotateY(90));
    return model;
}

function getBunnyModelMatrix(){
    return translate(0,0.7,1.7);
}
function getSignModelMatrix(){
    let model = scalem(1,1.2,1);
    model =   mult(model, translate(-1.5,0,-4.1));
    model = mult(model, rotateY(-30));
    return model;
}

function getLampModelMatrix() {
    return scalem(1, 1.8, 1);
}

/**
 * creates a shadow projection matrix which casts shadows from the light source position
 * @returns {[]}
 */
function getShadowMatrix(){
    let m = mat4();
    m[3][3] = 0;
    m[3][1] = -1 / lightPosition[1];

    let shadowMatrix = translate(lightPosition[0], lightPosition[1], lightPosition[2]);
    shadowMatrix = mult(shadowMatrix, m);
    shadowMatrix = mult(shadowMatrix, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]))
    return shadowMatrix;
}

/**
 * sends the model and view matrices to the vertex shader.
 */
function updateModelViewMatrix(){
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(modelMatrix));
}