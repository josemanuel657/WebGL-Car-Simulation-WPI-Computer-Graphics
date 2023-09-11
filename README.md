# WebGL-Car-Simulation
File and Directory Structure
Here's a breakdown of the files and folders included in this project:

data/

Houses different .obj, .mtl, and .blend files that are parsed and rendered in the simulation.
Contains texture files in .png format for detailing the car and other the traffic sign.
lib/

MV.js: Facilitates various matrix operations utilized throughout the project.
Model.js: Aids in parsing different .obj files.
Face.js: Assists in parsing different .mtl files.
webgl-utils.js: A standard library to facilitate communication with WebGL through JavaScript.
model_matrices.js

Defines different model matrices for various objects including the car, a bunny, a lamp, and other scene elements.
objects.js

Holds references to the .obj files and handles parsing, drawing, and texturing of objects.
Specifies light settings for different objects.
buffers.js: Ensures proper communication between the JavaScript WebGL framework and the WebGL setup in the index.html file.
index.html: Separated into vector and fragment shaders sections.
Establishes diverse settings for lighting, reflection, and refraction, controlled through different flags.
main.js

Initializes WebGL features in the browser through a canvas object.
Initiates the display render loop and assigns different hotkeys to perform actions in the scene.
Running the Project
To run the project, simply open the index.html file in a web browser.

Conclusion
This project stands as a testament to the implementation of computer graphics techniques through WebGL, illustrating my understanding and ability to create visually appealing graphical simulations. Thank you for your interest and feel free to explore and interact with the simulation to witness the graphical techniques in action.
