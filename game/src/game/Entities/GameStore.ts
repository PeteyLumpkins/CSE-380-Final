import GameNode from "../../Wolfie2D/Nodes/GameNode";
import StoreController from "../AI/Store/StoreController";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";

import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";

import { StoreEvents } from "../GameEnums";

export default class GameStore implements Updateable {

    private receiver: Receiver;
    private emitter: Emitter;

    private _node: GameNode;
    private _items: Record<string, any>;

    public constructor() {
        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.receiver.subscribe(StoreEvents.REQUEST_PURCHASE);
    }

    get node(): GameNode { return this._node; }
    set node(node: GameNode) { this._node = node; }

    get items(): Record<string, any> { return this._items; }
    set items(keys: Record<string, any>) { this._items = keys; }

    handleEvent(event: GameEvent): void {
        switch(event.type) {
            case StoreEvents.REQUEST_PURCHASE: {
                console.log("Store purchase request caught!");
                this.handleRequestPurchaseEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event in store; type: " + event.type);
                break;
            }
        }
    }

    // TODO: when the player wants to buy something, this is where the store handles the request
    /**
     * @param event reveives an event with two items;
     *    {
     *      id: - the id of the item to puchase (this will be the index of the item in the itemSprites json file)
     *      amount: - the amount of money the player is trying to purchase the item with
     *    }
     */
    handleRequestPurchaseEvent(event: GameEvent): void {
        if (event.data.get('amount') >= this._items[event.data.get('id')].cost) {
            console.log("firing valid purchasee");
            this.emitter.fireEvent(StoreEvents.VALID_PURCHASE);
        } else {
            console.log("fireing invalid purchase");
            this.emitter.fireEvent(StoreEvents.INVALID_PURCHASE);
        }
    }

    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

}