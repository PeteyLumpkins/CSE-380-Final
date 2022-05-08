import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./game/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Note - just because your program passes all of these tests does not mean your algorithm works.
    // The tests should cover most cases, but run your own to be sure

    // Set up options for our game
    let options = {
        canvasSize: {x: 1024, y: 800},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            { name: "forward", keys: ["w"] },   // Forward is assigned to w
            { name: "backward", keys: ["s"] },  // and so on...
            { name: "left", keys: ["a"] },
            { name: "right", keys: ["d"] },
            { name: "pause", keys: ["escape"]},
            { name: "open", keys: ["e"]},
            { name: "close", keys: ["e"]},
            { name: "nextlvl", keys: ["3"]},
            { name: "attack", keys: ["space"]},

            { name: "drop1", keys: ["1"]},
            { name: "drop2", keys: ["2"]},
            { name: "drop3", keys: ["3"]},
            { name: "drop4", keys: ["4"]},
            { name: "drop5", keys: ["5"]},
            { name: "drop6", keys: ["6"]},
            { name: "drop7", keys: ["7"]},
            { name: "drop8", keys: ["8"]},
            { name: "drop9", keys: ["9"]},
            { name: "pickup", keys: ["q"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

