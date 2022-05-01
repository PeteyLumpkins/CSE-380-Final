import Emitter from "../../../Wolfie2D/Events/Emitter";

export enum InventoryEvent {
    CHANGED = "INVENTORY_CHANGED_EVENT"
}

export default class Inventory {

    /* The players inventory items */
    private inventory: Array<string>;

    /* The maximum number of items allowed in the inventory */
    private maxItems: number;

    // Previous carry in 
    private prevInventory: Array<string>;

    /* Emitter to fire off inventory changed events */
    private emitter: Emitter;

    constructor(inventory: Array<string>, maxItems: number, options: Array<string>) {
        this.inventory = inventory;
        this.maxItems = maxItems;

        // TODO: i dont know if it should be in here that the previous invetory is passed into the new one and each item is added
        this.prevInventory = options;
        for(let item in this.prevInventory){
            this.addItem(item);
            console.log("Carryin from previous in PlayerInventory.ts of " + item);
        }

        this.emitter = new Emitter();
    }

    addItem(itemKey: string) {
        // If inv is full -> drop item at the player's feet
        if (this.inventory.length >= this.maxItems) {
            return null;
        } else {
            this.inventory.push(itemKey);
            this.emitter.fireEvent(InventoryEvent.CHANGED, {items: this.getCopy()});
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