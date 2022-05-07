import Scene from "../../Wolfie2D/Scene/Scene";

import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";

import MainMenu from "../Scenes/GameLevels/MainMenu";
import { GameEvents } from "../GameEnums";

import Color from "../../Wolfie2D/Utils/Color";

export enum PauseEvent {
    PAUSE = "PAUSE_PAUSE_EVENT",
    RESUME = "RESUME_PAUSE_EVENT",
    CONTROLS = "CONTROLS_PAUSE_EVENT",
    MAIN_MENU = "MAIN_MENU_PAUSE_EVENT"
}
/**
 * Manages the pausing and unpausing of the a list of game layers.
 */
export default class PauseManager implements Updateable {

    private scene: Scene;

    private receiver: Receiver;
    private emitter: Emitter;

    /* The layers that we want to pause/freeze */
    private layersToPause: Array<string>;
    private resumeLayer: string;

    /* Buttons on resume layer */
    private pausedBackground: Sprite;
    private resumeButton: Button;
    private controlsButton: Button;
    private mainMenuButton: Button;

    constructor(scene: Scene, layersToPause: Array<string>, resumeLayer: string) {
        this.scene = scene;
        this.layersToPause = layersToPause;
        this.resumeLayer = resumeLayer;

        this.initPausedLayer()

        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.receiver.subscribe(PauseEvent.RESUME);
        this.receiver.subscribe(PauseEvent.CONTROLS);
        this.receiver.subscribe(PauseEvent.MAIN_MENU);
    }

    update(deltaT: number): void { 
        while(this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    setResumeLayer(layer: string): void {
        this.resumeLayer = layer;
    }

    setLayersToPause(layers: Array<string>): void {
        this.layersToPause = layers;
    }

    pause(): void {
        for (let i = 0; i < this.layersToPause.length; i++) {
            let layer = this.scene.getLayer(this.layersToPause[i]);
            let items = layer.getItems();
            for (let j = 0; j < items.length; j++) {
                items[j].freeze();
            }
            layer.disable();
        }
        this.scene.getLayer(this.resumeLayer).enable();
    }

    unpause(): void {
        for (let i = 0; i < this.layersToPause.length; i++) {
            let layer = this.scene.getLayer(this.layersToPause[i]);
            let items = layer.getItems();
            for (let j = 0; j < items.length; j++) {
                items[j].unfreeze();
            }
            layer.enable();
        }
        this.scene.getLayer(this.resumeLayer).disable();
    }

    private handleEvent(event: GameEvent): void {
        switch(event.type) {
            case PauseEvent.RESUME: {
                console.log("Resume event caught!");
                this.handleResumeEvent(event);
                break;
            }
            case PauseEvent.CONTROLS: {
                console.log("Control event caught!");
                this.handleControlsEvent(event);
                break;
            }
            case PauseEvent.MAIN_MENU: {
                console.log("Main menu event caught!");
                this.handleMainMenuEvent(event);
                break;  
            }
            default: {
                console.log("Unknown event caught in pause manager");
                break;
            }
        }
    }

    private handleResumeEvent(event: GameEvent): void {
        this.unpause();
    }

    private handleControlsEvent(event: GameEvent): void {
        // In theory we'd display the game controls here
    }

    private handleMainMenuEvent(event: GameEvent): void {
        this.emitter.fireEvent(GameEvents.CHANGE_LEVEL, {"level": MainMenu});
    }

     /**
     * Initializes the paused UI layer on the screen. Should just be a box with three buttons: 
     * 
     *  1.) Resume - a button to resume the game
     *  2.) Controls - a button to view the controls for the game (seperate later)
     *  3.) Main Menu - a button to bring the player back to the main menu
     *  4.) Background - basically the background where all the buttons are
     */
    private initPausedLayer() {

        let center = this.scene.getViewport().getCenter();
        let scale = this.scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        console.log("View scale: " + scale);

        this.pausedBackground = this.scene.add.sprite("pausebg", this.resumeLayer);
        this.pausedBackground.position.set(center.x, center.y);
        this.pausedBackground.size.set(200, 200);
        this.pausedBackground.scale.div(scalar);

        // Resume button
        this.resumeButton = <Button>this.scene.add.uiElement(UIElementType.BUTTON, this.resumeLayer, {position: new Vec2(center.x, center.y - 50).div(scalar), text: "Resume"});
        this.resumeButton.size.set(100, 25);
        this.resumeButton.scale.div(scalar);
        this.resumeButton.borderWidth = 2;
        this.resumeButton.borderColor = Color.WHITE;
        this.resumeButton.backgroundColor = Color.TRANSPARENT;
        this.resumeButton.font = "Courier";
        this.resumeButton.fontSize = 16;
        this.resumeButton.onClickEventId = PauseEvent.RESUME;

        // Controls button
        this.controlsButton = <Button>this.scene.add.uiElement(UIElementType.BUTTON, this.resumeLayer, {position: new Vec2(center.x, center.y).div(scalar), text: "Controls"});
        this.controlsButton.size.set(100, 25);
        this.controlsButton.scale.div(scalar);
        this.controlsButton.borderWidth = 2;
        this.controlsButton.fontSize = 16;
        this.controlsButton.borderColor = Color.WHITE;
        this.controlsButton.backgroundColor = Color.TRANSPARENT;
        this.controlsButton.font = "Courier";
        this.controlsButton.onClickEventId = PauseEvent.CONTROLS;

        // Main Menu button
        this.mainMenuButton = <Button>this.scene.add.uiElement(UIElementType.BUTTON, this.resumeLayer, {position: new Vec2(center.x, center.y + 50).div(scalar), text: "Main Menu"});
        this.mainMenuButton.size.set(100, 25);
        this.mainMenuButton.scale.div(scalar);
        this.mainMenuButton.borderWidth = 2;
        this.mainMenuButton.fontSize = 16;
        this.mainMenuButton.borderColor = Color.WHITE;
        this.mainMenuButton.backgroundColor = Color.TRANSPARENT;
        this.mainMenuButton.font = "Courier";
        this.mainMenuButton.onClickEventId = PauseEvent.MAIN_MENU;

        // Initially we hide the pause layer
        this.scene.getLayer(this.resumeLayer).setHidden(true);
    }
}