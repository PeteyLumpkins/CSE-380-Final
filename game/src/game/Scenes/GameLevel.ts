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
import { PlayerEvents } from "../AI/Player/PlayerController";
import GameStore from "../Entities/GameStore";

import InventoryManager from "../GameSystems/InventoryManager";
import PauseManager from "../GameSystems/PauseManager";
import StoreManager from "../GameSystems/StoreManager";

export enum UILayers {
    ITEM_BAR = "UI_LAYER_ITEM_BAR",
    PRIMARY = "UI_LAYER_PRIMARY",
    ITEM_SLOTS = "UI_LAYER_ITEM_SLOTS",
    ITEM_SPRITES = "ITEM_SPRITE_LAYER",

    LEVEL = "LEVEL_LAYER", 
    PAUSED = "PAUSED_LAYER",
    CONTROLS = "CONTROLS_LAYER",

    STORE_BG = "STORE_BG_LAYER",
    STORE_COSTS = "STORE_COSTS_LAYER",
    STORE_NAMES = "STORE_NAMES_LAYER",
    STORE_CONTROLS = "STORE_CONTROLS_LAYER",
    STORE_ITEMS = "STORE_ITEMS_LAYER",
}

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
    protected inventoryManager: InventoryManager;
    
    /* STORE UI COMPONENTS */
    protected storeManager: StoreManager;

    /* MORE UI COMPONENTS */
    protected itemBarBackground: Sprite;

    protected pauseManager: PauseManager;
    protected pauseButton: Button;

    loadScene(): void {}

    startScene(): void {

        // Init layers
        this.addPauseUILayers();
        this.addStoreUILayers();
        this.initViewport();

        this.inventoryManager = new InventoryManager(this, 9, 16, new Vec2(450, 24), UILayers.ITEM_SLOTS, "itembg", UILayers.ITEM_SPRITES);

        this.initUIPrimary();
        this.pauseManager = new PauseManager(this, [GameLayers.PRIMARY], GameLayers.PAUSED);

        this.storeManager = new StoreManager(
            this, 
            GameSprites.STORE_BG, 
            3, 
            [ItemSprites.MOLD_BREAD, ItemSprites.MOLD_BREAD, ItemSprites.MOLD_BREAD], 
            UILayers.STORE_BG,
            UILayers.STORE_ITEMS, 
            UILayers.STORE_NAMES, 
            UILayers.STORE_COSTS,
            UILayers.STORE_CONTROLS
        );

        this.subscribeToEvents();
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleGameEvent(this.receiver.getNextEvent());
        }

        this.pauseManager.update(deltaT);
        this.storeManager.update(deltaT);

        this.store.update(deltaT);
    }

    protected addPauseUILayers(): void {

        /* Add layers */
        this.addUILayer(UILayers.ITEM_BAR);
        this.addUILayer(UILayers.PRIMARY);
        this.addUILayer(UILayers.ITEM_SLOTS);
        this.addUILayer(UILayers.ITEM_SPRITES);

        this.addUILayer(UILayers.PAUSED);

        /* Set layer depths */
        this.getLayer(UILayers.ITEM_BAR).setDepth(0);
        this.getLayer(UILayers.PRIMARY).setDepth(1);
        this.getLayer(UILayers.ITEM_SLOTS).setDepth(1);
        this.getLayer(UILayers.ITEM_SPRITES).setDepth(2);
    }

    protected addStoreUILayers(): void {

        /* Add layers */
        this.addUILayer(UILayers.STORE_BG);
        this.addUILayer(UILayers.STORE_NAMES);
        this.addUILayer(UILayers.STORE_ITEMS);
        this.addUILayer(UILayers.STORE_COSTS);
        this.addUILayer(UILayers.STORE_CONTROLS);

        /* Set layer depths */
        this.getLayer(UILayers.STORE_BG).setDepth(0);
        this.getLayer(UILayers.STORE_NAMES).setDepth(1);
        this.getLayer(UILayers.STORE_ITEMS).setDepth(1);
        this.getLayer(UILayers.STORE_COSTS).setDepth(1);
        this.getLayer(UILayers.STORE_CONTROLS).setDepth(1);
    }

    protected subscribeToEvents(): void {
        console.log("Subscribing to events");
        this.receiver.subscribe(GameEvents.CHANGE_LEVEL);
        this.receiver.subscribe(GameEvents.PAUSE);
        
        this.receiver.subscribe(StoreEvents.INVALID_PURCHASE);
        this.receiver.subscribe(StoreEvents.VALID_PURCHASE);

        this.receiver.subscribe(PlayerEvents.MONEY_CHANGE);
        this.receiver.subscribe(PlayerEvents.HEALTH_CHANGE);
        // this.receiver.subscribe(GameEventType.KEY_DOWN);
    }

    protected handleGameEvent(event: GameEvent) {
        switch(event.type) {
            case GameEvents.PAUSE: {
                console.log("Pause event caught!");
                this.eventHandlers.pause(event);
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
                this.eventHandlers.changeLevel(event);
                break;
            }
            case PlayerEvents.MONEY_CHANGE: {
                console.log("Change in player's money caught in GameLevel!");
                this.eventHandlers.moneyChange(event);
                break;
            }
            case PlayerEvents.HEALTH_CHANGE: {
                console.log("Change in player's health caught in GameLevel!");
                this.eventHandlers.healthChange(event);
                break;
            }
            case GameEventType.KEY_DOWN: {
                switch(event.data.get("key")) {
                    case "escape": {
                        this.pauseManager.pause();
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

    /**
     * This is an object that contains the handlers for each of the events
     * the main GameLevel is subscribed to. They're mostly related to the UI
    */
    protected eventHandlers = {

        changeLevel: (ev: GameEvent) => { 
            this.sceneManager.changeToScene(ev.data.get("level")); 
        },
    
        pause: (ev : GameEvent) => {
            this.pauseManager.pause();
        },

        moneyChange: (ev: GameEvent) => {
            this.playerMoneyLabel.text = `Peter's Money: ${ev.data.get("amount")}`;
        },

        healthChange: (ev: GameEvent) => {
            this.playerHealthLabel.text = `Peter's Health: ${ev.data.get("amount")}`;
        }
    }

    // FIXME: For some reason the lines aren't being drawn between the nodes in th debug map
    protected createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer(GameLayers.NAVMESH_GRAPH, 10);
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

    protected initUIPrimary(): void {
        let scale = this.getViewScale();
        let scalar = new Vec2(scale, scale);

        this.playerHealthLabel = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.PRIMARY, {position: new Vec2(120, 32).div(scalar), text: "Health: " + (this.playerHealth)});
        this.playerHealthLabel.size.set(100, 50);
        this.playerHealthLabel.scale.div(scalar);
        this.playerHealthLabel.textColor = Color.WHITE;
        this.playerHealthLabel.fontSize = 20;
        this.playerHealthLabel.font = "Courier";

        this.playerMoneyLabel = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.PRIMARY, {position: new Vec2(300, 32).div(scalar), text: "Money: " + (this.playerMoney)});
        this.playerMoneyLabel.size.set(100, 50);
        this.playerMoneyLabel.scale.div(scalar);
        this.playerMoneyLabel.textColor = Color.WHITE;
        this.playerMoneyLabel.fontSize = 20;
        this.playerMoneyLabel.font = "Courier";

        this.pauseButton = <Button>this.add.uiElement(UIElementType.BUTTON, UILayers.PRIMARY, {position: new Vec2(950, 32).div(scalar), text: "Pause"});
        this.pauseButton.size.set(100, 50);
        this.pauseButton.scale.div(scalar);
        this.pauseButton.textColor = Color.WHITE;
        this.pauseButton.borderWidth = 2;
        this.pauseButton.borderColor = Color.WHITE;
        this.pauseButton.backgroundColor = Color.TRANSPARENT;
        this.pauseButton.onClickEventId = GameEvents.PAUSE;
        this.pauseButton.fontSize = 20;
        this.pauseButton.font = "Courier";

        this.itemBarBackground = this.add.sprite("itembarbg", UILayers.ITEM_BAR);
        this.itemBarBackground.position.set(this.viewport.getCenter().x, 32).div(scalar);
        this.itemBarBackground.scale.div(scalar);
    }

    protected initViewport(): void {
        this.viewport.setZoomLevel(3);
    }

    /**
     * Override this method to initialize the player
     */
    initPlayer(): void {}

    /**
     * Override this method to initialize the store
     */
    initStore(): void {}

    /** 
     * Override this method to initialize the levels map
     */
    initMap(): void {}

    /** 
     * Override this method to set the next and prev levels
     */
    initLevelLinks(): void {}

    /** 
     * Override this method to add enemies to your level
     */
    initEnemies(): void {}

}