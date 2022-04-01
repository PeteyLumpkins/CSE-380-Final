import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Color from "../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

import PlayerController from "../AI/Player/PlayerController";

export enum GameLayers {
    PRIMARY = "PRIMARY_LAYER",
    UI = "UI_LAYER",
    LEVEL = "LEVEL_LAYER", 
    PAUSED = "PAUSEED_LAYER",
    CONTROLS = "CONTROLS_LAYER"
}

export enum GameEvents {
    PAUSE = "PAUSE_EVENT",
    RESUME = "RESUME_EVENT",
    CONTROLS = "CONTROLS_EVENT",
    MAIN_MENU = "MAIN_MENU_EVENT"
}

export default class GameLevel extends Scene {

    // Player stuff?
    protected MAX_PLAYER_HEALTH: number = 20;
    protected playerHealth: number;
    protected playerSpawn: Vec2;
    protected playerHealthLabel: Label;
    protected player: AnimatedSprite;

    // Store Node
    protected store: AnimatedSprite;
    
    // Buttons in the UI
    protected pauseButton: Button;
    protected resumeButton: Button;
    protected controlsButton: Button;
    protected mainMenuButton: Button;

    // Paused background
    protected pausedBackground: Label;


    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        // Initialize layers
        this.initUILayer();
        this.initPausedLayer();

        // Subscribe to Events
        this.receiver.subscribe(GameEvents.PAUSE);
        this.receiver.subscribe(GameEvents.RESUME);
        this.receiver.subscribe(GameEvents.CONTROLS);
        this.receiver.subscribe(GameEvents.MAIN_MENU);
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
                this.handlePauseEvent(event);
                break;
            }
            case GameEvents.RESUME: {
                console.log("Resume event caught!");
                this.handleResumeEvent(event);
                break;
            }
            case GameEvents.CONTROLS: {
                console.log("Control event caught!");
                this.handleControlsEvent(event);
                break;
            }
            case GameEvents.MAIN_MENU: {
                console.log("Main menu event caught!");
                this.handleMainMenuEvent(event);
                break;  
            }

            default: {
                console.log("Unknown event caught in GameLevel reciever. Did you add a case in the switch statement and a handler for your event?");
                break;
            }
        }
    }

    // TODO: This handler should freeze the game
    protected handlePauseEvent(ev: GameEvent) {
        this.getLayer(GameLayers.PAUSED).setHidden(false);
        // Need to freeze the AI and tiled layer?
    }

    // TODO: This handler should unfreeze the game
    protected handleResumeEvent(ev: GameEvent) {
        this.getLayer(GameLayers.PAUSED).setHidden(true);
        // Need to unfreeze the AI and stuff?
    }

    // TODO: This handler should bring up with controls for the game
    protected handleControlsEvent(ev: GameEvent) {

    }

    // TODO: This method should bring us back to the main menu. We might be passing some
    // data back to the main menu via the second param. Stuff about levels unlocked maybe?
    protected handleMainMenuEvent(ev: GameEvent) {
        this.sceneManager.changeToScene(MainMenu, {});
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
     *  4.) Background - basically the background where all the buttons are
     * 
     * 
     *  |----------------------------------------------------------------|
     *  |                                                                |
     *  |                   |-------------|                              |
     *  |                   |   Resume    |                              |
     *  |                   |-------------|                              |
     *  |                                                                |
     *  |                   |-------------|                              |
     *  |                   |   Controls  |                              |
     *  |                   |-------------|                              |
     *  |                                                                |
     *  |                   |-------------|                              |
     *  |                   |  Main Menu  |                              |
     *  |                   |-------------|          background          |
     *  |                                                                |
     *  |----------------------------------------------------------------|
     */
    protected initPausedLayer() {

        const pauseLayer = this.addLayer(GameLayers.PAUSED);
        let center = this.viewport.getCenter();

        this.pausedBackground = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.PAUSED, {position: new Vec2(center.x, center.y), text: ""});
        this.pausedBackground.size.set(200, 200);
        this.pausedBackground.backgroundColor = Color.TRANSPARENT;
        this.pausedBackground.borderWidth = 2;
        this.pausedBackground.borderColor = Color.BLACK;

        // Resume button
        this.resumeButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y - 50), text: "Resume"});
        this.resumeButton.size.set(100, 25);
        this.resumeButton.borderWidth = 2;
        this.resumeButton.fontSize = 16;
        this.resumeButton.backgroundColor = Color.BLACK;
        this.resumeButton.onClickEventId = GameEvents.RESUME;

        // Controls button
        this.controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y), text: "Controls"});
        this.controlsButton.size.set(100, 25);
        this.controlsButton.borderWidth = 2;
        this.controlsButton.fontSize = 16;
        this.controlsButton.backgroundColor = Color.BLACK;
        this.controlsButton.onClickEventId = GameEvents.CONTROLS;

        // Main Menu button
        this.mainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y + 50), text: "Main Menu"});
        this.mainMenuButton.size.set(100, 25);
        this.mainMenuButton.borderWidth = 2;
        this.mainMenuButton.fontSize = 16;
        this.mainMenuButton.backgroundColor = Color.BLACK;
        this.mainMenuButton.onClickEventId = GameEvents.MAIN_MENU;

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
    

}