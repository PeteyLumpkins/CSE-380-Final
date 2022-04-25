import Player from "./Player";
import Input from "../../Wolfie2D/Input/Input";
import PickupAI from "../AI/Pickup/PickupAI";
import { PickupTypes } from "../AI/Pickup/PickupTypes";
import { GameLayers } from "../GameEnums";

import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Receiver from "../../Wolfie2D/Events/Receiver";

export enum InventoryEvent {
    CHANGED = "INVENTORY_CHANGED_EVENT"
}

export default class Inventory {

    /* The player associated with the inventory items*/
    private player: Player;

    /* The players inventory items */
    private inventory: Array<string>;

    /* The maximum number of items allowed in the inventory */
    private maxItems: number;

    /* Emitter to fire off inventory changed events */
    private emitter: Emitter;

    constructor(player: Player, inventory: Array<string>, maxItems: number) {
        this.player = player;
        this.inventory = inventory;
        this.maxItems = maxItems;

        this.emitter = new Emitter();
    }

    addItem(itemKey: string) {
        // If inv is full -> drop item at the player's feet
        if (this.inventory.length >= this.maxItems) {
            // This is where I drop the item on the ground instead
            this.player.removeBuffs(itemKey);

            let itemDrop = this.player.node.getScene().add.sprite(itemKey, GameLayers.PRIMARY);

            itemDrop.position.set(this.player.node.position.x, this.player.node.position.y);
            itemDrop.scale.set(2, 2);

            itemDrop.addAI(PickupAI, {
                canPickup: () => {
                    return this.player.node.position.distanceTo(itemDrop.position) <= 50;
                },
                pickup: () => {
                    return Input.isPressed("pickup");
                },
                data: {
                    type: PickupTypes.ITEM,
                    itemKey: itemKey
                }
            });
            

        } else {
            this.inventory.push(itemKey);
            this.player.addBuffs(itemKey);
            this.emitter.fireEvent(InventoryEvent.CHANGED, {items: this.getCopy()});
        }
    }

    removeItem(index: number) {
        if (index < this.inventory.length) {
            let itemKey = this.inventory.splice(index, 1)[0];
            this.player.removeBuffs(itemKey);

            let itemDrop = this.player.node.getScene().add.sprite(itemKey, GameLayers.PRIMARY);

            itemDrop.position.set(this.player.node.position.x, this.player.node.position.y);
            itemDrop.scale.set(2, 2);

            itemDrop.addAI(PickupAI, {
                canPickup: () => {
                    return this.player.node.position.distanceTo(itemDrop.position) <= 50;
                },
                pickup: () => {
                    return Input.isPressed("pickup");
                },
                data: {
                    type: PickupTypes.ITEM,
                    itemKey: itemKey
                }
            });

            this.emitter.fireEvent(InventoryEvent.CHANGED, {items: this.getCopy()});
        }
    }

    getCopy(): Array<string> {
        return new Array<string>(...this.inventory);
    }
}