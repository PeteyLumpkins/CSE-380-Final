import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Color from "../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export enum GameLayers {
    PRIMARY = "primary",
    UI = "ui",
    LEVEL = "level", 
    PAUSED = "paused",
    CONTROLS = "controls"
}

export enum GameEvents {
    PAUSE = "pause"
}

export default class GameLevel extends Scene {

    // Player stuff
    protected MAX_PLAYER_HEALTH: number = 20;
    protected playerHealth: number;
    protected playerSpawn: Vec2;
    protected playerHealthLabel: Label;
    
    // Pause button
    protected pauseButton: Button;

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        // Initialize layers
        this.initUILayer();


        // Subscribe to Events
        this.receiver.subscribe(GameEvents.PAUSE);
    }


    updateScene() {
        while(this.receiver.hasNextEvent()) {
            this.handleGameEvent(this.receiver.getNextEvent());
        }
    }

    protected handleGameEvent(event: GameEvent) {
        
        switch(event.type) {
            case GameEvents.PAUSE: {
                console.log("Pause event caught!");
                break;
            }

            default: {
                console.log("Unknown event caught in GameLevel reciever. Did you add a case in the switch statement and a handler for your event?");
                break;
            }
        }
    }

    protected handlePauseEvent() {

    }

    /**
     * Initializes the UI layer of the game. We'll need labels for a few different labels
     * andd we'll probably add more later.
     * 
     * PLAYER_HEALTH - a label to keep track of the players health
     * 
     * PAUSE_BUTTON - a simple pause button that will freeze the scene and pull up the
     * pause layer.
     * 
     */
    protected initUILayer() {

        const uilayer = this.addLayer(GameLayers.UI);

        this.playerHealthLabel = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.UI, {position: new Vec2(120, 30), text: "Peter's Health: " + (this.playerHealth)});
        this.playerHealthLabel.textColor = Color.WHITE;
        this.playerHealthLabel.fontSize = 20;
        this.playerHealthLabel.font = "PixelSimple";

        this.pauseButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.UI, {position: new Vec2(1000, 30), text: "Pause"});
        this.pauseButton.size.set(100, 50);
        this.pauseButton.textColor = Color.WHITE;
        this.pauseButton.borderWidth = 2;
        this.pauseButton.backgroundColor = Color.BLACK;
        this.pauseButton.onClickEventId = GameEvents.PAUSE;

        uilayer.setHidden(false);
    }

    /**
     * Initializes the paused UI layer on the screen. Should just be a box with three buttons: 
     * 
     *  1.) Resume - a button to resume the game
     *  2.) Controls - a button to view the controls for the game (seperate later)
     *  3.) Main Menu - a button to bring the player back to the main menu
     */
    initPausedLayer() {

        const pauseLayer = this.addLayer(GameLayers.PAUSED);


        // Initially we hide the pause layer
        pauseLayer.setHidden(true);
    }

    /**
     * Initializes the controls layer that will pop up when the player presses the "controls"
     * button on the paused dialogue button or whatever
     * 
     *  1.) Should have a little close button in the top right our something
     *  2.) If the 'resume' button of the pause button is visible and is pressed, this
     *      layer should become invisible and the game should resume. (ie game shouldn't be 
     *      player with controls layer still visible).
     */
    initControlsLayer() {

    }

    /**
     * Initializes our player. 
     * 
     * PLAYER SPAWN - should spawn the player at the passed down spawn point or
     * spawn the player at (0, 0) if the spawn is not given
     * 
     * PLAYER SPRITE - should set the player node to be the player sprite. The 
     * name of the sprite will be specified in an enum somewhere...
     * 
     * PLAYER CONTROLLER - sets up the AI and controls for the player. We should 
     * have that for the most part via the player controller
     */
    initPlayer(){

    }

}