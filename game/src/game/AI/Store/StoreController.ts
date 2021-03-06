import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";

import Disabled from "./StoreStates/Disabled";
import Enabled from "./StoreStates/Enabled";
import Open from "./StoreStates/Open";

import StoreItems from "./StoreItems"

export enum StoreStates {
    DISABLED = "STORE_DISABLED",
    ENABLED = "STORE_ENABLED",
    OPEN = "STORE_OPEN"
}

export default class StoreController extends StateMachineAI {

    owner: AnimatedSprite;
    target: GameNode;
    items: StoreItems;
    range: number;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        
        this.owner = owner;

        this.items = options.items;
        this.range = options.radius
        this.target = options.target;
        
        this.addState(StoreStates.DISABLED, new Disabled(this, this.owner));
        this.addState(StoreStates.ENABLED, new Enabled(this, this.owner));
        this.addState(StoreStates.OPEN, new Open(this, this.owner));

        this.initialize(StoreStates.DISABLED);
    }

    update(deltaT: number): void {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    
    activate(options: Record<string, any>) {}  
    
    destroy(): void {}

}