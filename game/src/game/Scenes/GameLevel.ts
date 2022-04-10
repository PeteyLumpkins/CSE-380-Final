import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./GameLevels/MainMenu";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

/* Imports for the navmesh */
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";

import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Input from "../../Wolfie2D/Input/Input";

import PlayerController from "../AI/Player/PlayerController";
import StoreController from "../AI/Store/StoreController";

import { GameEvents, GameLayers, GameSprites, GameData, StoreEvents, ItemSprites } from "../GameEnums";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameStore from "../Entities/GameStore";

export default abstract class GameLevel extends Scene {

    /* PLAYER CONSTANTS */
    private DEFAULT_PLAYER_HEALTH: number = 20;
    private DEFAULT_PLAYER_SPAWN: Vec2 = new Vec2(0, 0);
    private DEFAULT_PLAYER_SCALE: Vec2 = new Vec2(1, 1);

    /* PLAYER ATTRIBUTES */
    protected playerHealth: number = this.DEFAULT_PLAYER_HEALTH;
    protected playerSpawn: Vec2 = this.DEFAULT_PLAYER_SPAWN;
    protected playerScale: Vec2 = this.DEFAULT_PLAYER_SPAWN;
    protected playerHealthLabel: Label;
    protected player: AnimatedSprite;

    /* NEXT AND PREV LEVELS */
    protected nextLevel: Sprite;
    protected prevLevel: Sprite;

    protected playerMoney: number = 0;
    protected playerMoneyLabel: Label;

    /* ENEMIES LIST */
    protected enemies: Array<AnimatedSprite>;

    /* THE GAMES LEVEL */
    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    /* GAME STORE */
    protected store: GameStore;
    
    /* STORE UI COMPONENTS */
    protected storeBackground: AnimatedSprite;
    protected storeItems: Array<Sprite>;
    protected storeItemNameLabels: Array<Label>;
    protected storeItemCostLabels: Array<Label>;
    protected storeButtons: Array<Button>; 
    
    /* PAUSE AND UNPAUSE BUTTONS */
    protected pauseButton: Button;
    protected resumeButton: Button;
    protected controlsButton: Button;
    protected mainMenuButton: Button;

    // Paused background
    protected pausedBackground: Label;

    loadScene(): void {}

    startScene(): void {

        // Init layers
        this.addLayers();
        this.createNavmesh();
        this.initViewport();
        this.initPlayer();

        this.initUILayer();
        this.initPausedLayer();

        this.initStore();
        this.initStoreLayer();

        // Subscribe to Events
        this.subscribeToEvents();
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleGameEvent(this.receiver.getNextEvent());
        }
        this.store.update(deltaT);
    }

    protected addLayers(): void {
        console.log("Adding layers");
        this.addUILayer(GameLayers.UI);

        this.addUILayer(GameLayers.PAUSED);
        this.getLayer(GameLayers.PAUSED).setDepth(2);

        this.addUILayer(GameLayers.STORE_CONTROLS);
        this.getLayer(GameLayers.STORE_CONTROLS).setDepth(1);

        this.addUILayer(GameLayers.STORE_ITEMS);
        this.getLayer(GameLayers.STORE_ITEMS).setDepth(1);

        this.addUILayer(GameLayers.STORE_BG);

        this.addLayer(GameLayers.PRIMARY, 5);
    }

    protected subscribeToEvents(): void {
        console.log("Subscribing to events");
        this.receiver.subscribe(GameEvents.PAUSE);
        this.receiver.subscribe(GameEvents.RESUME);
        this.receiver.subscribe(GameEvents.CONTROLS);
        this.receiver.subscribe(GameEvents.MAIN_MENU);
        this.receiver.subscribe(GameEvents.OPEN_STORE);
        this.receiver.subscribe(GameEvents.CLOSE_STORE);
        this.receiver.subscribe(GameEvents.CHANGE_LEVEL);

        this.receiver.subscribe(StoreEvents.INVALID_PURCHASE);
        this.receiver.subscribe(StoreEvents.VALID_PURCHASE);
        // this.receiver.subscribe(GameEventType.KEY_DOWN);
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
            case StoreEvents.VALID_PURCHASE: {
                console.log("Valid store purchasee caught in GameLevel!");
                break;
            }
            case StoreEvents.INVALID_PURCHASE: {
                console.log("Invalid store purchase caught in GameLevel!");
                break;
            }
            case GameEvents.CHANGE_LEVEL: {
                console.log("Change Level caught in GameLevel!");
                this.handleChangeLevelEvent(event);
                break;
            }
            case GameEventType.KEY_DOWN: {
                switch(event.data.get("key")) {
                    case "escape": {
                        this.handlePauseEvent(event);
                        break;
                    }
                }
                break;
            }
            default: {
                console.log("Unknown event caught in GameLevel reciever. Did you add a case in the switch statement and a handler for your event?");
                break;
            }
        }
    }

    protected handleChangeLevelEvent(ev: GameEvent) {
        console.log(ev.data.get("level"));
        this.sceneManager.changeToScene(ev.data.get("level"));
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

    // FIXME: For some reason the lines aren't being drawn between the nodes in th debug map
    protected createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer(GameLayers.NAVMESH_GRAPH, -1);
        // gLayer.setHidden(true);

        let navmeshData = this.load.getObject(GameData.NAVMESH);

         // Create the graph
        this.navmeshGraph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.navmeshGraph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, GameLayers.NAVMESH_GRAPH, {position: new Vec2(node[0], node[1])});
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.navmeshGraph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: this.navmeshGraph.getNodePosition(edge[0]), end: this.navmeshGraph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.navmeshGraph);

        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    /**
     * FIXME: The controls and displays on the UI layer need to be adjusted to fit the screen. Right now
     * they're a little messed up and the pause button is off the screen 
     */
    protected initUILayer() {

        let scalar = new Vec2(this.getViewScale(), this.getViewScale());
        let scale = this.getViewScale();

        this.playerHealthLabel = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.UI, {position: new Vec2(120, 30).div(scalar), text: "Peter's Health: " + (this.playerHealth)});
        this.playerHealthLabel.size.set(100/scale, 50/scale);
        this.playerHealthLabel.textColor = Color.WHITE;
        this.playerHealthLabel.fontSize = 20;
        this.playerHealthLabel.font = "PixelSimple";

        this.playerMoneyLabel = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.UI, {position: new Vec2(500, 30).div(scalar), text: "Peter's Money: " + (this.playerMoney)});
        this.playerMoneyLabel.size.set(100/scale, 50/scale);
        this.playerMoneyLabel.textColor = Color.WHITE;
        this.playerMoneyLabel.fontSize = 20;
        this.playerMoneyLabel.font = "PixelSimple";

        this.pauseButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.UI, {position: new Vec2(950, 30).div(scalar), text: "Pause"});
        this.pauseButton.size.set(100/scale, 50/scale);
        this.pauseButton.textColor = Color.WHITE;
        this.pauseButton.borderWidth = 2;
        this.pauseButton.backgroundColor = Color.BLACK;
        this.pauseButton.onClickEventId = GameEvents.PAUSE;


        console.log(this.pauseButton.relativePosition);
        console.log(this.pauseButton.position);
        // this.getLayer(GameLayers.UI).setHidden(true);
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

        let center = this.viewport.getCenter();
        let scalar = new Vec2(this.getViewScale(), this.getViewScale());
        let scale = this.getViewScale();

        console.log("View scale: " + scale);

        this.pausedBackground = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.PAUSED, {position: new Vec2(center.x, center.y).div(scalar), text: ""});
        this.pausedBackground.size.set(200/scale, 200/scale);
        this.pausedBackground.backgroundColor = Color.TRANSPARENT;
        this.pausedBackground.borderWidth = 2;
        this.pausedBackground.borderColor = Color.BLACK;

        // Resume button
        this.resumeButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y - 50).div(scalar), text: "Resume"});
        this.resumeButton.size.set(100/scale, 25/scale);
        this.resumeButton.borderWidth = 2;
        this.resumeButton.fontSize = 16;
        this.resumeButton.backgroundColor = Color.BLACK;
        this.resumeButton.onClickEventId = GameEvents.RESUME;

        // Controls button
        this.controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y).div(scalar), text: "Controls"});
        this.controlsButton.size.set(100/scale, 25/scale);
        this.controlsButton.borderWidth = 2;
        this.controlsButton.fontSize = 16;
        this.controlsButton.backgroundColor = Color.BLACK;
        this.controlsButton.onClickEventId = GameEvents.CONTROLS;

        // Main Menu button
        this.mainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.PAUSED, {position: new Vec2(center.x, center.y + 50).div(scalar), text: "Main Menu"});
        this.mainMenuButton.size.set(100/scale, 25/scale);
        this.mainMenuButton.borderWidth = 2;
        this.mainMenuButton.fontSize = 16;
        this.mainMenuButton.backgroundColor = Color.BLACK;
        this.mainMenuButton.onClickEventId = GameEvents.MAIN_MENU;

        // Initially we hide the pause layer
        this.getLayer(GameLayers.PAUSED).setHidden(true);
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

    protected initViewport(): void {
        this.viewport.setZoomLevel(1);
    }

    /**
     * TODO: This method will initialize the store layer of our game. It should be called
     * after the level has been loaded, I'm pretty sure.
     */
    protected initStoreLayer() {
        let center = this.viewport.getCenter();
        let scale = this.getViewScale();

        this.storeBackground = this.add.animatedSprite(GameSprites.STORE_BG, GameLayers.STORE_BG);
        this.storeBackground.position.set(this.viewport.getCenter().x/scale, this.viewport.getCenter().y/scale);
        this.storeBackground.animation.play("idle");

        let storeItems = this.store.items;
        if (storeItems === undefined || storeItems.length === 0) {
            throw new Error("No items in the store. There should be at least 1 item.");
        }

        /* STORE BUTTONS */
        this.storeButtons = new Array<Button>();
        let startX = center.x - 150;
        let startY = center.y + 100;
        let spaceX = 150;

        for (let i = 0; i < storeItems.length; i++) {
            this.storeButtons[i] = <Button>this.add.uiElement(UIElementType.BUTTON, GameLayers.STORE_CONTROLS, {position: new Vec2(startX, startY).scale(scale), text: "Buy Item " + (i + 1)});
            this.storeButtons[i].size.set(100/scale, 25/scale);
            this.storeButtons[i].borderWidth = 2;
            this.storeButtons[i].fontSize = 16;
            this.storeButtons[i].backgroundColor = Color.BLACK;
            this.storeButtons[i].onClick = () => {
                this.emitter.fireEvent(StoreEvents.REQUEST_PURCHASE, { 
                    id: i,
                    amount: this.playerMoney
                });
            };
            startX += spaceX;
        }

        /* STORE ITEMS */
        this.storeItems = new Array<Sprite>();
        
        startX = center.x - 150;
        startY = center.y - 100;
        spaceX = 150;

        for (let i = 0; i < storeItems.length; i += 1, startX += spaceX) {
            this.storeItems[i] = this.add.sprite(ItemSprites.MOLD_BREAD, GameLayers.STORE_ITEMS);
            this.storeItems[i].position.set(startX, startY);
            this.storeItems[i].scale.set(5, 5);
        }

        /* STORE ITEM NAME LABELS */
        this.storeItemNameLabels = new Array<Label>();

        startX = center.x - 150;
        startY = center.y - 175;
        spaceX = 150;

        for (let i = 0; i < storeItems.length; i += 1, startX += spaceX) {
            this.storeItemNameLabels[i] = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.STORE_ITEMS, {position: new Vec2(startX, startY), text: storeItems[i].name});
            this.storeItemNameLabels[i].fontSize = 18;
            this.storeItemNameLabels[i].textColor = Color.WHITE;
        }

        /* STORE ITEM COST LABELS */
        this.storeItemCostLabels = new Array<Label>();

        startX = center.x - 150;
        startY = center.y - 25;
        spaceX = 150;

        for (let i = 0; i < storeItems.length; i += 1, startX += spaceX) {
            this.storeItemCostLabels[i] = <Label>this.add.uiElement(UIElementType.LABEL, GameLayers.STORE_ITEMS, {position: new Vec2(startX, startY), text: `Cost: ${storeItems[i].cost}`});
            this.storeItemCostLabels[i].fontSize = 18;
            this.storeItemCostLabels[i].textColor = Color.WHITE;
        }

        this.getLayer(GameLayers.STORE_BG).setHidden(true);
        this.getLayer(GameLayers.STORE_CONTROLS).setHidden(true);
        this.getLayer(GameLayers.STORE_ITEMS).setHidden(true);
    }

    protected initPlayer() {
        this.player = this.add.animatedSprite(GameSprites.PLAYER, GameLayers.PRIMARY);
		
		this.player.position.set(this.playerSpawn.x, this.playerSpawn.y);
        this.player.scale.set(this.playerScale.x, this.playerScale.y);

		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.size.x/2*this.player.scale.x, this.player.size.y/2*this.player.scale.y));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);
        
		this.player.addAI(PlayerController);

        this.viewport.follow(this.player);
    }

    protected initStore() {
        this.store = new GameStore();

        this.store.node = this.add.animatedSprite(GameSprites.STORE, GameLayers.PRIMARY);
        this.store.node.position.set(this.viewport.getCenter().clone().x , this.viewport.getCenter().clone().y - 32*4);
        (<AnimatedSprite>this.store.node).scale.set(0.4, 0.4);
        this.store.node.addAI(StoreController, {radius: 100, player: this.player});

        this.store.items = this.load.getObject(GameData.STORE_ITEMS);
    }
    

}