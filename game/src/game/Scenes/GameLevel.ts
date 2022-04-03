import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import PlayerController from "../AI/Player/PlayerController";
import { GameEvents, GameLayers, GameSprites } from "../GameEnums";

export default abstract class GameLevel extends Scene {

    // Player stuff?
    private DEFAULT_PLAYER_HEALTH: number = 20;
    private DEFAULT_PLAYER_SPAWN: Vec2 = new Vec2(0, 0);

    protected playerHealth: number;
    protected playerSpawn: Vec2;
    protected playerHealthLabel: Label;
    protected player: AnimatedSprite;

    // Store Sprite (enabled/disabled sprite)
    protected store: AnimatedSprite;

    // Main store background
    protected storeBackground: AnimatedSprite;
    
    // Buttons in the UI
    protected pauseButton: Button;
    protected resumeButton: Button;
    protected controlsButton: Button;
    protected mainMenuButton: Button;

    // Paused background
    protected pausedBackground: Label;

    loadScene(): void {}

    startScene(): void {

        // Initialize layers
        this.initUILayer();
        this.initPausedLayer();
        // this.initStoreLayer();

        // Subscribe to Events
        this.receiver.subscribe(GameEvents.PAUSE);
        this.receiver.subscribe(GameEvents.RESUME);
        this.receiver.subscribe(GameEvents.CONTROLS);
        this.receiver.subscribe(GameEvents.MAIN_MENU);
        this.receiver.subscribe(GameEvents.OPEN_STORE);
        this.receiver.subscribe(GameEvents.CLOSE_STORE);
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
            case GameEvents.OPEN_STORE: {
                console.log("Open store event caught!");
                this.handleOpenStoreEvent(event);
                break;
            }
            case GameEvents.CLOSE_STORE: {
                console.log("Close store event caught!");
                this.handleCloseStoreEvent(event);
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

    // TODO: Handles opening up the game store - should pause the rest of the game
    protected handleOpenStoreEvent(ev: GameEvent) {
        this.getLayer(GameLayers.STORE_BG).setHidden(false);
        this.getLayer(GameLayers.STORE_CONTROLS).setHidden(false);
        this.getLayer(GameLayers.STORE_ITEMS).setHidden(false);
    }

    // TODO: Handles closing the games store
    protected handleCloseStoreEvent(ev: GameEvent) {
        this.getLayer(GameLayers.STORE_BG).setHidden(true);
        this.getLayer(GameLayers.STORE_CONTROLS).setHidden(true);
        this.getLayer(GameLayers.STORE_ITEMS).setHidden(true);
    }

    /**
     * FIXME: The controls and displays on the UI layer need to be adjusted to fit the screen. Right now
     * they're a little messed up and the pause button is off the screen 
     */
    protected initUILayer() {

        const uilayer = this.addUILayer(GameLayers.UI);

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
    private initPausedLayer() {

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
    private initControlsLayer() {

    }

    /**
     * TODO: This method will initialize the store layer of our game. It should be called
     * after the level has been loaded, I'm pretty sure.
     */
    private initStoreLayer() {
        const storeBgLayer = this.addLayer(GameLayers.STORE_BG);
        this.storeBackground = this.add.animatedSprite(GameSprites.STORE_BG, GameLayers.STORE_BG);
        this.storeBackground.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);

       const storeControlsLayer = this.addLayer(GameLayers.STORE_CONTROLS);
       const storeItemsLayer = this.addLayer(GameLayers.STORE_ITEMS);
    }
    

}