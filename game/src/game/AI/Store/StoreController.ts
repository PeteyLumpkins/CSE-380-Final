import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

import Disabled from "./StoreStates/Disabled";
import Enabled from "./StoreStates/Enabled";
import Open from "./StoreStates/Open";

import {StoreEvents} from "../../GameEnums";

export enum StoreStates {
    DISABLED = "STORE_DISABLED",
    ENABLED = "STORE_ENABLED",
    OPEN = "STORE_OPEN"
}

export default class StoreController extends StateMachineAI {

    protected owner: AnimatedSprite;
    protected player: GameNode;
    protected range: Circle;

    // TODO: The store controller takes and option that sets the radius of the
    // of it's circle range or whatever
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        
        this.owner = owner;
        console.log("Options.radius: " + options.radius);

        this.range = new Circle(owner.position, options.radius);
        this.player = options.player;
        
        let disabled = new Disabled(this, this.owner);
        this.addState(StoreStates.DISABLED, disabled);
        let enabled = new Enabled(this, this.owner);
        this.addState(StoreStates.ENABLED, enabled);
        let open = new Open(this, this.owner);
        this.addState(StoreStates.OPEN, open);

        this.initialize(StoreStates.DISABLED);

        this.receiver.subscribe(StoreEvents.REQUEST_PURCHASE);
    }

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

    handleRequestPurchaseEvent(event: GameEvent): void {
        console.log(event.data);
    }

    update(deltaT: number): void {
        super.update(deltaT);
    }

    getRange(): Circle { return this.range; }

    getPlayerPosition(): Vec2 { return this.player.position; }
    
    activate(options: Record<string, any>) {}  
    
    destroy(): void {}

}