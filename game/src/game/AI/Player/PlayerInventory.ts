import Emitter from "../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export enum InventoryEvent {
    CHANGED = "INVENTORY_CHANGED_EVENT"
}

export default class Inventory {

    /* The players inventory items */
    private inventory: Array<string>;

    /* The maximum number of items allowed in the inventory */
    private maxItems: number;

    /* Emitter to fire off inventory changed events */
    private emitter: Emitter;

    constructor(inventory: Array<string>, maxItems: number) {
        this.inventory = inventory;
        this.maxItems = maxItems;

        this.emitter = new Emitter();
    }

    addItem(itemKey: string) {
        // If inv is full -> drop item at the player's feet
        if (this.inventory.length >= this.maxItems) {
            return null;
        } else {
            this.inventory.push(itemKey);
            this.emitter.fireEvent(InventoryEvent.CHANGED, {items: this.getCopy()});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "itempickup", loop: false, holdReference: true});
            return itemKey;
        }
    }

    removeItem(index: number): string {
        if (index < this.inventory.length) {
            let itemKey = this.inventory.splice(index, 1)[0];
            this.emitter.fireEvent(InventoryEvent.CHANGED, {items: this.getCopy()});
            return itemKey;
        }
        return null;
    }

    getCopy(): Array<string> {
        return new Array<string>(...this.inventory);
    }
}