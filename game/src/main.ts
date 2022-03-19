import Game from "./Wolfie2D/Loop/Game";
import { Homework3Shaders } from "./game/HW3_Enums";
import GradientCircleShaderType from "./game/GradientCircleShaderType";
import MainMenu from "./game/Scenes/MainMenu";
import AABB from "./Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import Circle from "./Wolfie2D/DataTypes/Shapes/Circle";
import Homework3_Scene from "./game/Scenes/HW3_Scene";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import LinearGradientCircleShaderType from "./game/LinearGradientCircleShaderType";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Note - just because your program passes all of these tests does not mean your algorithm works.
    // The tests should cover most cases, but run your own to be sure

    // Set up options for our game
    let options = {
        canvasSize: {x: 900, y: 900},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            { name: "forward", keys: ["w"] },   // Forward is assigned to w
            { name: "backward", keys: ["s"] },  // and so on...
            { name: "left", keys: ["a"] },
            { name: "right", keys: ["d"] },
        ],
        useWebGL: true,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // We have a custom shader, so lets add it to the registry and preload it
    // The registry essentially just ensures that we can locate items by name later, rather than needing
    // the class constructor. Here, we additionally make sure to preload the data so our
    // shader is available throughout the application
    RegistryManager.shaders.registerAndPreloadItem(
        Homework3Shaders.GRADIENT_CIRCLE,   // The key of the shader program
        GradientCircleShaderType,           // The constructor of the shader program
        "hw3_assets/shaders/gradient_circle.vshader",   // The path to the vertex shader
        "hw3_assets/shaders/gradient_circle.fshader");  // the path to the fragment shader*/

    // This is the custom shader that you'll implement, although currently it's exactly the same as our gradient circle shader
    RegistryManager.shaders.registerAndPreloadItem(
        Homework3Shaders.LINEAR_GRADIENT_CIRCLE,   // The key of the shader program
        LinearGradientCircleShaderType,           // The constructor of the shader program
        "hw3_assets/shaders/linear_gradient_circle.vshader",   // The path to the vertex shader
        "hw3_assets/shaders/linear_gradient_circle.fshader");  // the path to the fragment shader*/

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

