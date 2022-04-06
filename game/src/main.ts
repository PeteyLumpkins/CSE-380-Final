import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./game/Scenes/GameLevels/MainMenu";
import Level1 from "./game/Scenes/GameLevels/Level1";
import GameLevel from "./game/Scenes/GameLevel";
import AITest from "./game/Scenes/TestLevels/AITest";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Note - just because your program passes all of these tests does not mean your algorithm works.
    // The tests should cover most cases, but run your own to be sure

    // Set up options for our game
    let options = {
        canvasSize: {x: 1024, y: 1024},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            { name: "forward", keys: ["w"] },   // Forward is assigned to w
            { name: "backward", keys: ["s"] },  // and so on...
            { name: "left", keys: ["a"] },
            { name: "right", keys: ["d"] },
            { name: "pause", keys: ["escape"]},
            { name: "open", keys: ["1"]},
            { name: "close", keys: ["2"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

