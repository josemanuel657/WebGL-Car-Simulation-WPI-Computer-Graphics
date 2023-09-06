// buffers
let vPosition;
let nPosition;
let vTexCoord;

/**
 * sends the vertices to the vertex shader
 */
function setVectorBuffers(){
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

/**
 * sends the normals to the vertex shader
 */
function setNormalBuffers() {
    let nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    nPosition = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(nPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(nPosition);
}

/**
 * sends the texture coordinates to the vertex shader
 */
function setTextureBuffers(){
    let tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, 0, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
}

/**
 * disables the texture attribute
 */
function disableTextureBuffers() {
    gl.disableVertexAttribArray(vTexCoord);
}