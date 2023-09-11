# WebGL-Car-Simulation
Welcome to the WebGL Car Simulation project, a vivid and immersive 3D environment that brings to life a dynamic roundabout scene. My name is Jose Manuel and I am an undergraduate student studying computer science at Worcester Polytechnic Institute. This project is the final assigment for CS 543 (Computer Graphics).

# Overview
Leveraging cutting-edge WebGL and JavaScript techniques, the project showcases a vibrant interactive 3D simulation encapsulating the following elements:

- The Car: Positioned at the epicenter of the action, the car moves gracefully around the roundabout, offering a spectacle of computer graphics prowess through realistic textures and materials.
- Bunny on the Car: Adding a whimsical touch is a bunny situated atop the car. The bunny maintains its position regardless of the car's movements, achieved through a hierarchical modeling approach.
- Stop Sign: Guiding the car’s path is a stop sign, showcasing the potential for integrating road safety elements into graphical simulations.
- Lamp in the Roundabout: Standing tall in the midst of the roundabout is a lamp that casts light, adding depth and realism to the scene.
- Skybox: Surrounding the entire scene is a skybox adorned with captivating textures, enhancing the visual appeal and immersion of the simulation.
- Reflection and Refraction: Witness dynamic reflections and refractions in action, which can be toggled and manipulated through dedicated hotkeys to alter the visual experience.
- Interactive Camera: Engage with a flexible camera system that allows for rotations and movements through different hotkeys, including an exhilarating in-car view to immerse oneself in the driver’s seat.

Realism in this simulation is heightened with dynamic reflections and refractions, which can be explored through various viewing angles including an immersive in-car perspective.

# Interactive Hotkeys
Users can interact with the scene using various hotkeys, unlocking different perspectives, and manipulating reflection and refraction settings to witness the scene under different graphical setups.

- L: Toggle light on/off.
- S: Toggle shadow application on/off.
- C: Activate/deactivate camera control mode.
- M: Engage/disengage car control mode.
- D: Switch between camera perspectives, toggling the camera's attachment to the car.
- E: Enable/disable the skybox effect.
- R: Turn reflections on/off.
- F: Toggle refractions on/off.

# File and Directory Structure
Here's a breakdown of the files and folders included in this project:

data/: 
  - Houses different .obj, .mtl, and .blend files that are parsed and rendered in the simulation.
  - Contains texture files in .png format for detailing the car and other the traffic sign.

lib/:
  - MV.js: Facilitates various matrix operations utilized throughout the project.
  - Model.js: Aids in parsing different .obj files.
  - Face.js: Assists in parsing different .mtl files.
  - webgl-utils.js: A standard library to facilitate communication with WebGL through JavaScript.
  - model_matrices.js: Defines different model matrices for various objects including the car, a bunny, a lamp, and other scene elements.

objects.js: 
  - Holds references to the .obj files and handles parsing, drawing, and texturing of objects. 
  - Specifies light settings for different objects.

buffers.js: 
  - Ensures proper communication between the JavaScript WebGL framework and the WebGL setup in the index.html file.

index.html: 
  - Separated into vector and fragment shaders sections.
  - Establishes diverse settings for lighting, reflection, and refraction, controlled through different flags.

main.js: 
  - Initializes WebGL features in the browser through a canvas object.
  - Initiates the display render loop and assigns different hotkeys to perform actions in the scene.

# Running the Project
To run the project, simply open the index.html file in a web browser.

# Conclusion
This project stands as a testament to the implementation of computer graphics techniques through WebGL. Thank you for your interest and feel free to explore and interact with the simulation and the code as you like! 
