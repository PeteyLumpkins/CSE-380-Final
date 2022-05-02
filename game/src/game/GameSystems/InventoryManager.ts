import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";

import Receiver from "../../Wolfie2D/Events/Receiver";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Color from "../../Wolfie2D/Utils/Color";
import Scene from "../../Wolfie2D/Scene/Scene";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import { InventoryEvent } from "../AI/Player/PlayerInventory";

/**
 * Manages the player inventory that is displayed in the GameLevel UI
 */
export default class InventoryManager implements Updateable {

    /* Important stuff */
    private scene: Scene;

    /* Event handling stuff */
    private receiver: Receiver;

    /* Inventory UI stuff */
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

    constructor(scene: Scene, items: Array<string>, size: number, padding: number, start: Vec2, itemLayer: string, slotSprite: string, slotLayer: string) {

        this.scene = scene;

        this.receiver = new Receiver();

        this.receiver.subscribe(InventoryEvent.CHANGED);

        this.size = size;
        this.padding = padding;
        this.start = start;
        this.slotSprite = slotSprite;

        // Init the layers for the items
        this.slotLayer = slotLayer;
        this.itemLayer = itemLayer;

        // Set up the scales for scaling to the viewport
        let scale = scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        // Load the item slot sprites
        this.itemSlots = new Array<Sprite>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i] = this.scene.add.sprite(this.slotSprite, this.slotLayer);
            this.itemSlots[i].scale.div(scalar);
        }

        // Set the positions of the item slot sprites
        let width = this.itemSlots[0].size.x;
        let height = this.itemSlots[0].size.y;
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i].position.set(this.start.x + i*(width + this.padding), this.start.y).div(scalar);
        }

        this.itemSprites = new Array<Sprite>();

        // Set the slot numbers in the user interface
        this.itemSlotNums = new Array<Label>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlotNums[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x + i*(width + this.padding), start.y + height/2 + 8).div(scalar), text: `${i + 1}`});
            this.itemSlotNums[i].fontSize = 12;
            this.itemSlotNums[i].font = "Courier";
            this.itemSlotNums[i].textColor = Color.WHITE;
        }

        this.loadItems(items);
    }

    private handleEvent(event: GameEvent): void {
        switch(event.type) {
            case InventoryEvent.CHANGED: {
                this.loadItems(event.data.get("items"));
                break;
            }
            default: {
                break;
            }
        }
    }

    private loadItems(inv: Array<string>): void {
        let scale = this.scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        for (let i = 0; i < this.itemSprites.length; i += 1) {
            this.itemSprites[i].destroy();
        }

        this.itemSprites = new Array<Sprite>();
        for (let i = 0; i < inv.length; i += 1) {
            if (inv[i] === null) { 
                continue;
            }
            let oldSprite = this.itemSprites[i]
            this.itemSprites[i] = this.scene.add.sprite(inv[i], this.itemLayer);
            this.itemSprites[i].position.set(this.start.x + i*(this.itemSlots[0].size.x + this.padding), this.start.y).div(scalar);
            if (oldSprite !== undefined) {
                oldSprite.destroy();
            }
            
        }
    }

    /**
     * Updates the inventory being displayed in the UI
     */
    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent())
        }
    }

}