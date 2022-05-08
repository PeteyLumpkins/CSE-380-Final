import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";

import items from "./items.json";

import { GameEvents, GameLayers, GameSprites, GameData, StoreEvents, ItemSprites } from "../../GameEnums";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { PlayerEvents } from "../../AI/Player/PlayerController";

import GameOver from "../GameOver";

import PlayerController from "../../AI/Player/PlayerController";
import InventoryManager from "../../GameSystems/InventoryManager";
import PauseManager from "../../GameSystems/PauseManager";
import StoreManager from "../../GameSystems/StoreManager";


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

    /* THE PLAYER */
    protected player: AnimatedSprite;
    protected playerSpawn: Vec2;
    protected startingItems: Array<string>;
    protected startingStats: Record<string, any>;

    /* PLAYER UI STATS */
    protected playerHealthLabel: Label;
    protected playerMoneyLabel: Label;

    
    /* MORE UI COMPONENTS */
    protected itemBarBackground: Sprite;
    protected pauseButton: Button;

    /* NEXT AND PREV LEVELS LINKS */
    protected nextLevel: Sprite;
    protected prevLevel: Sprite;

    /* SHOP LEVEL LINK */
    protected shop: Sprite;

    /* THE ARRAY OF ENEMY NODES */
    protected enemies: Array<AnimatedSprite>;

    /* GAME STORE */
    protected store: AnimatedSprite;
    
    /* UI MANAGERS */
    protected storeManager: StoreManager;
    protected pauseManager: PauseManager;
    protected inventoryManager: InventoryManager;

    /**
     * Any shared resources between the levels of the game will be loaded and kept by each of the 
     * classes that extend the GameLevel class. Each class extending the GameLevel class will probs
     * have it's own level specific data that it also needs to load.
     * 
     * The idea is to group the common loads in the top level game level class, and specific stuff 
     * in each of the specific levels (like maps and map data)
     */
    loadScene(): void {

        /** Loading all the images / static sprites that all the levels will need */
        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");
        for (let i = 0; i < items.length; i++) {
            this.load.image(items[i].key, items[i].path);
        }
        this.load.image("itembg", "assets/sprites/itembg.png");
        this.load.image("itembarbg", "assets/sprites/itembarbg.png");
        this.load.image("pausebg", "assets/sprites/pause_bg.png");

        /** Loads any spitesheets that all the levels will need */
        this.load.spritesheet("player", "assets/spritesheets/player/player.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store/store_terminal.json");
        this.load.spritesheet("brokenGreenPipe", "assets/sprites/BrokenGreenPipe.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store/store_layer.json");
        this.load.spritesheet("rat", "assets/spritesheets/enemies/rat.json");
        this.load.spritesheet("whiteRat", "assets/spritesheets/enemies/whiteRat.json");
        this.load.spritesheet(GameSprites.COIN, "assets/spritesheets/coin.json");

        /** Loads any data/object files that all the levels will need - probs just item data */
        this.load.object('item-data', 'assets/data/item-data.json');
        this.load.object(GameData.STORE_ITEMS, "assets/data/item-data.json");

        /** Loading all of the sound effects that all the levels will need */
        this.load.audio("hitSound", "assets/soundEffects/smack.wav");
        this.load.audio("coinSound", "assets/soundEffects/coin.wav");
        this.load.audio("footstep", "assets/soundEffects/footstep1.wav");
        this.load.audio("buySound", "assets/soundEffects/shopBuy.wav");
        this.load.audio("textbox", "assets/soundEffects/textbox.wav");
        this.load.audio("itemdrop", "assets/soundEffects/itemDrop.wav");
        this.load.audio("itempickup", "assets/soundEffects/itemPickup.wav");
        this.load.audio("invalidbuy", "assets/soundEffects/invalidStore.wav");
    }

    unloadScene(): void {

        /** Keeps all the images the next level will need */
        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");
        for (let i = 0; i < items.length; i++) {
            this.load.keepImage(items[i].key);
        }
        this.load.keepImage("itembg");
        this.load.keepImage("itembarbg");
        this.load.keepImage("pausebg");

        /** Keeps all the spritesheets we'll need later */
        this.load.keepSpritesheet("player");
        this.load.keepSpritesheet("store_terminal");
        this.load.keepSpritesheet("brokenGreenPipe");
        this.load.keepSpritesheet(GameSprites.STORE_BG);
        this.load.keepSpritesheet("rat");
        this.load.keepSpritesheet("whiteRat");
        this.load.keepSpritesheet(GameSprites.COIN);

        /** Keeps the objects we'll need later */
        this.load.keepObject('item-data');
        this.load.keepObject(GameData.STORE_ITEMS);

        /** Keeping the sound effects */
        this.load.keepAudio("hitSound");
        this.load.keepAudio("coinSound");
        this.load.keepAudio("footstep");
        this.load.keepAudio("buySound");
        this.load.keepAudio("textbox");
        this.load.keepAudio("itemdrop");
        this.load.keepAudio("itempickup");
        this.load.keepAudio("invalidbuy");
    }

    startScene(): void {

        this.initViewport();

        this.initPlayer();
        this.addPrimaryUILayers();
        this.initUIPrimary();

        this.addItemUILayers();
        this.inventoryManager = new InventoryManager(this, this.startingItems, 9, 16, new Vec2(450, 24), UILayers.ITEM_SPRITES, "itembg", UILayers.ITEM_SLOTS);

        let pausedLayers = [
            GameLayers.PRIMARY, 
        ];
        this.pauseManager = new PauseManager(this, pausedLayers, GameLayers.PAUSED);

        this.addStoreUILayers();
        this.storeManager = new StoreManager(
            this, 
            GameSprites.STORE_BG, 
            3, 
            UILayers.STORE_BG,
            UILayers.STORE_ITEMS, 
            UILayers.STORE_NAMES, 
            UILayers.STORE_COSTS,
            UILayers.STORE_CONTROLS
        );

        this.initMap();

        this.initEnemies();

        this.initStore();

        /* Init the level links of the game level */
        this.initLevelLinks();

        /* Subscribe to any events */
        this.subscribeToEvents();

    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleGameEvent(this.receiver.getNextEvent());
        }

        this.pauseManager.update(deltaT);
        this.storeManager.update(deltaT);
        this.inventoryManager.update(deltaT);
    }

    private addPrimaryUILayers(): void {
        this.addUILayer(UILayers.ITEM_BAR);
        this.addUILayer(UILayers.PRIMARY);

        /* Set depths of layers */
        this.getLayer(UILayers.PRIMARY).setDepth(1);
        this.getLayer(UILayers.ITEM_BAR).setDepth(0);
    }

    private addItemUILayers(): void {

        /* Add layers */
        this.addUILayer(UILayers.ITEM_SLOTS);
        this.addUILayer(UILayers.ITEM_SPRITES);

        this.addUILayer(UILayers.PAUSED);

        /* Set layer depths */
        this.getLayer(UILayers.ITEM_SLOTS).setDepth(1);
        this.getLayer(UILayers.ITEM_SPRITES).setDepth(2);
        this.getLayer(UILayers.PAUSED).setDepth(5);
    }

    private addStoreUILayers(): void {

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

    private subscribeToEvents(): void {
        this.receiver.subscribe(GameEvents.CHANGE_LEVEL);
        this.receiver.subscribe(GameEvents.PAUSE);

        this.receiver.subscribe(StoreEvents.INVALID_PURCHASE);
        this.receiver.subscribe(StoreEvents.VALID_PURCHASE);

        this.receiver.subscribe(PlayerEvents.MONEY_CHANGE);
        this.receiver.subscribe(PlayerEvents.HEALTH_CHANGE);
        this.receiver.subscribe(GameEventType.KEY_DOWN);
    }

    private handleGameEvent(event: GameEvent) {
        switch(event.type) {
            case GameEvents.PAUSE: {
                console.log("Pause event caught!");
                this.eventHandlers.pause(event);
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
            this.sceneManager.changeToScene(ev.data.get("level"), ev.data.get("data"));   // Send player spawn as data into the new level
        },
    
        pause: (ev : GameEvent) => {
            this.pauseManager.pause();
        },

        moneyChange: (ev: GameEvent) => {
            this.playerMoneyLabel.text = `Money: ${ev.data.get("amount")}`;
        },

        healthChange: (ev: GameEvent) => {
            let hp = ev.data.get("amount");
            this.playerHealthLabel.text = `Health: ${hp}`;
            // TODO: this is where the gameover event will be triggered I'm pretty sure?
            if (hp <= 0) {
                this.sceneManager.changeToScene(GameOver, {
                    stats: (<PlayerController>this.player._ai).playerStats
                });
            }
        }
    }

    protected initUIPrimary(): void {
        let scale = this.getViewScale();
        let scalar = new Vec2(scale, scale);

        this.playerHealthLabel = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.PRIMARY, {position: new Vec2(120, 32).div(scalar), text: "Health: " + (this.startingStats["HEALTH"])});
        this.playerHealthLabel.size.set(100, 50);
        this.playerHealthLabel.scale.div(scalar);
        this.playerHealthLabel.textColor = Color.WHITE;
        this.playerHealthLabel.fontSize = 20;
        this.playerHealthLabel.font = "Courier";

        this.playerMoneyLabel = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.PRIMARY, {position: new Vec2(300, 32).div(scalar), text: "Money: " + (this.startingStats["MONEY"])});
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

        let center = this.viewport.getCenter()
        center.sub(this.viewport.getOrigin());

        this.itemBarBackground = this.add.sprite("itembarbg", UILayers.ITEM_BAR);
        this.itemBarBackground.position.set(center.x, 32 / scale);
        this.itemBarBackground.scale.div(scalar);
    }

    /**
     * Override and set the zoom of the viewport here
     * 
     * FIXME: There are issues cropping up with the viewport whenever we transition from
     * one scene to the next. It looks like it just keeps scaling/zooming in the viewport.
     * 
     */
    abstract initViewport(): void;

    /**
     * Override this method to initialize the player
     */
    abstract initPlayer(): void;

    /**
     * Override this method to initialize the store
     */
    abstract initStore(): void;

    /** 
     * Override this method to initialize the levels map
     */
    abstract initMap(): void;

    /** 
     * Override this method to set the next and prev levels
     */
    abstract initLevelLinks(): void;

    /** 
     * Override this method to add enemies to your level
     */
    abstract initEnemies(): void;

}