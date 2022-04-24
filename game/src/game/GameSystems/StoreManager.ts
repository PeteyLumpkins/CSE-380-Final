import Scene from "../../Wolfie2D/Scene/Scene";

import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../Wolfie2D/Nodes/UIElements/Button"
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";

import Emitter from "../../Wolfie2D/Events/Emitter";
import Receiver from "../../Wolfie2D/Events/Receiver";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Color from "../../Wolfie2D/Utils/Color";

import { GameEvents } from "../GameEnums";

import Player from "../Player/Player";


export enum StoreEvent {
    BUY_ITEM = "BUY_ITEM_STORE_EVENT",
    ITEM_PURCHASED = "ITEM_PURCHASE_EVENT"
}

export default class StoreManager implements Updateable {

    /* The scene */
    private scene: Scene;
    private numItems: number;

    private receiver: Receiver;

    /* Store related data */
    protected storeItems: Array<string>;
    protected player: Player;

    /* Store UI Layers */
    private backgroundLayer: string;
    private itemLayer: string;
    private nameLayer: string;
    private costLayer: string;
    private buttonLayer: string;

    /* Store UI Components */
    protected storeBackgroundSprite: string;
    protected storeBackground: AnimatedSprite;
    protected itemSprites: Array<Sprite>;
    protected itemNameLabels: Array<Label>;
    protected itemCostLabels: Array<Label>;
    protected itemBuyButtons: Array<Button>; 

    constructor(scene: Scene, storeBackgroundSprite: string, numItems: number, 
        backgroundLayer: string, itemLayer: string, nameLayer: string, costLayer: string, buttonLayer: string) {

            this.scene = scene;
            this.numItems = numItems;

            this.storeBackgroundSprite = storeBackgroundSprite;

            this.backgroundLayer = backgroundLayer;
            this.itemLayer = itemLayer;
            this.nameLayer = nameLayer;
            this.costLayer = costLayer;
            this.buttonLayer = buttonLayer;

            this.receiver = new Receiver();

            this.receiver.subscribe(GameEvents.OPEN_STORE);
            this.receiver.subscribe(GameEvents.CLOSE_STORE);

            this.loadStoreControls();
    }

    update(deltaT: number) {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    openStore() {
        this.scene.getLayer(this.backgroundLayer).enable();
        this.scene.getLayer(this.itemLayer).enable();
        this.scene.getLayer(this.costLayer).enable();
        this.scene.getLayer(this.nameLayer).enable();
        this.scene.getLayer(this.buttonLayer).enable();
    }

    closeStore() {
        this.scene.getLayer(this.backgroundLayer).disable();
        this.scene.getLayer(this.itemLayer).disable();
        this.scene.getLayer(this.costLayer).disable();
        this.scene.getLayer(this.nameLayer).disable();
        this.scene.getLayer(this.buttonLayer).disable();
    }

    private handleEvent(event: GameEvent): void {
        switch(event.type) {
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
                console.log("")
                break;
            }
        }
    }

    private handleOpenStoreEvent(event: GameEvent) {
        this.storeItems = event.data.get("items");
        this.player = event.data.get("player");

        this.loadStoreItems();
        this.openStore();
    }

    /**
     * This method loads the items from the given items list into the UI of the store. The items
     * in the array items should have a format similar to the following:
     * 
     * item = {
     *      spriteKey: string - the string associated with the items sprite for the item
     *      cost: number - the cost of this item
     *      name: string - the items name
     * }
     * @param items the items in the store
     */
    private loadStoreItems(): void {

        /* Initialization stuff for sprites position calculations*/
        let center = this.scene.getViewport().getCenter();
        let origin = this.scene.getViewport().getOrigin();
        let scale = this.scene.getViewScale();
        let scalar = new Vec2(scale, scale);
        
        let spaceX = 150 / scale;
        let spaceY = 100 / scale;
        let startX = center.x - spaceX;
        let startY = center.y - spaceY;

        /* Getting the item data */
        let items = this.scene.load.getObject("item-data");


        for (let i = 0; i < this.numItems; i += 1, startX += spaceX) {
            let oldsprite = this.itemSprites[i];

            this.itemSprites[i] = this.scene.add.sprite(this.storeItems[i], this.itemLayer);
            this.itemSprites[i].position.set(startX, startY).sub(origin);
            this.itemSprites[i].scale.set(5, 5).div(scalar);

            this.itemCostLabels[i].text = items[this.storeItems[i]].cost;
            this.itemNameLabels[i].text = items[this.storeItems[i]].name;

            if (oldsprite !== undefined && oldsprite !== null ) {
                oldsprite.destroy();
            }
        }
    }

    /**
     * This method will initialize the store layer of our game. It should be called
     * after the level has been loaded, I'm pretty sure.
     */
    private loadStoreControls() {
        let center = this.scene.getViewport().getCenter();
        let scale = this.scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        this.storeBackground = this.scene.add.animatedSprite(this.storeBackgroundSprite, this.backgroundLayer);
        this.storeBackground.scale.div(scalar);
        this.storeBackground.position.set(this.scene.getViewport().getCenter().x, this.scene.getViewport().getCenter().y).div(scalar);
        this.storeBackground.animation.play("idle");

        /* STORE BUTTONS */
        this.itemBuyButtons = new Array<Button>();
        let startX = center.x - 150;
        let startY = center.y + 100;
        let spaceX = 150;

        for (let i = 0; i < this.numItems; i++) {
            this.itemBuyButtons[i] = <Button>this.scene.add.uiElement(UIElementType.BUTTON, this.buttonLayer, {position: new Vec2(startX, startY).div(scalar), text: "Buy Item " + (i + 1)});
            this.itemBuyButtons[i].size.set(100, 25);
            this.itemBuyButtons[i].scale.div(scalar);
            this.itemBuyButtons[i].borderWidth = 2;
            this.itemBuyButtons[i].fontSize = 16;
            this.itemBuyButtons[i].backgroundColor = Color.BLACK;
            this.itemBuyButtons[i].onClick = () => {
                this.handleItemPurchase(i);
            };
            startX += spaceX;
        }

        /* STORE ITEM SPRITE ARRAY */
        this.itemSprites = new Array<Sprite>();

        /* STORE ITEM NAME LABELS */
        this.itemNameLabels = new Array<Label>();

        startX = center.x - 150;
        startY = center.y - 175;
        spaceX = 150;

        for (let i = 0; i < this.numItems; i += 1, startX += spaceX) {
            this.itemNameLabels[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.nameLayer, {position: new Vec2(startX, startY).div(scalar), text: ""});
            this.itemNameLabels[i].fontSize = 18;
            this.itemNameLabels[i].textColor = Color.WHITE;
            this.itemNameLabels[i].scale.div(scalar);
        }

        /* STORE ITEM COST LABELS */
        this.itemCostLabels = new Array<Label>();

        startX = center.x - 150;
        startY = center.y - 25;
        spaceX = 150;

        for (let i = 0; i < this.numItems; i += 1, startX += spaceX) {
            this.itemCostLabels[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.costLayer, {position: new Vec2(startX, startY).div(scalar), text: ""});
            this.itemCostLabels[i].fontSize = 18;
            this.itemCostLabels[i].textColor = Color.WHITE;
            this.itemCostLabels[i].scale.div(scalar);
        }

        /* STORE SPRITE POSITIONS */
        this.itemSprites = new Array<Sprite>();
        this.closeStore();
    }

    private handleCloseStoreEvent(event: GameEvent) {
        this.closeStore();
    }

    private handleItemPurchase(index: number): void {
        let items = this.scene.load.getObject("item-data");
        let itemData = items[this.storeItems[index]];

        this.player.inventory.addItem(this.storeItems[index]);
        this.player.stats.setStat("MONEY", this.player.stats.getStat("MONEY") - itemData.cost);
    }

}