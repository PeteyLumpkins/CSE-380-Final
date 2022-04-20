import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

import Emitter from "../../Wolfie2D/Events/Emitter";
import Receiver from "../../Wolfie2D/Events/Receiver";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Color from "../../Wolfie2D/Utils/Color";
import Scene from "../../Wolfie2D/Scene/Scene";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";

// import { StoreEvent } from "./StoreManager";
import PlayerController from "../AI/Player/PlayerController";


/**
 * Manages the player inventory that is displayed in the GameLevel UI
 */
export default class InventoryManager implements Updateable {

    /* Important stuff */
    private scene: Scene;
    private player: GameNode;

    /* Event handling stuff */
    private receiver: Receiver;
    private emitter: Emitter;

    private start: Vec2;
    private padding: number;
    private itemSlots: Array<Sprite>;
    private itemSlotNums: Array<Label>;
    private itemSprites: Array<Sprite>;

    /* Inventory UI Layers */
    private slotSprite: string;
    private itemLayer: string;
    private slotLayer: string;

    private size: number;

    constructor(scene: Scene, player: GameNode, size: number, padding: number, start: Vec2, itemLayer: string, slotSprite: string, slotLayer: string) {

        this.scene = scene;
        this.player = player;

        this.receiver = new Receiver();
        this.emitter = new Emitter();

        // this.receiver.subscribe(StoreEvent.ITEM_PURCHASED);

        this.size = size;
        this.padding = padding;
        this.start = start;
        this.slotSprite = slotSprite;

        // TODO: Maybe set the layers up in the game level, then just pass the layer names to the manager
        this.slotLayer = slotLayer;
        this.itemLayer = itemLayer;

        let scale = scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        this.itemSlots = new Array<Sprite>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i] = this.scene.add.sprite(this.slotSprite, this.slotLayer);
            this.itemSlots[i].scale.div(scalar);
        }
        let width = this.itemSlots[0].size.x;
        let height = this.itemSlots[0].size.y;
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i].position.set(this.start.x + i*(width + this.padding), this.start.y).div(scalar);
        }

        this.itemSlotNums = new Array<Label>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlotNums[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + i*(width + this.padding), start.y + height/2 + 8).div(scalar), text: `${i + 1}`});
            this.itemSlotNums[i].fontSize = 12;
            this.itemSlotNums[i].font = "Courier";
            this.itemSlotNums[i].textColor = Color.WHITE;
        }
    }

    /**
     * Updates to invetory being displayed in the UI to display the inventory 
     * represented by @param inventory
     * 
     * @param inventory the inventory we want display in the UI
     */
    setInventory(inventory: Array<String>): void {

    }

    setSlot(slot: number, item: Sprite): void {}

    unsetSlot(slot: number): Sprite { return; }

    // private handleEvent(event: GameEvent): void {
    //     switch(event.type) {
    //         case StoreEvent.ITEM_PURCHASED: {
    //             console.log("Item purchased event caught in invetory handler");
    //             console.log(event.data.get("item"));
    //             break;
    //         }
    //         default: {
    //             break;
    //         }
    //     }
    // }

    /**
     * Updates the inventory being displayed in the UI
     */
    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            // this.handleEvent(this.receiver.getNextEvent())
        }

        let inventory = (<PlayerController>this.player._ai).getPlayerInventory()
        for (let i = 0; i < inventory.length; i++) {
            this.itemSprites[i] = this.scene.add.sprite(inventory[i].spriteKey, this.itemLayer);
        }
        
    }



}