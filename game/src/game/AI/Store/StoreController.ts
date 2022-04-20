import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

import Disabled from "./StoreStates/Disabled";
import Enabled from "./StoreStates/Enabled";
import Open from "./StoreStates/Open";

import StoreItems from "./StoreItems";
import PlayerController from "../Player/PlayerController";

import {StoreEvents} from "../../GameEnums";

export enum StoreStates {
    DISABLED = "STORE_DISABLED",
    ENABLED = "STORE_ENABLED",
    OPEN = "STORE_OPEN"
}

export default class StoreController extends StateMachineAI {

    protected owner: AnimatedSprite;
    protected player: GameNode;

    protected items: Array<Record<string,any>>;

    protected range: Circle;

    // TODO: The store controller takes and option that sets the radius of the
    // of it's circle range or whatever
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        
        this.owner = owner;
        console.log("Options.radius: " + options.radius);

        this.items = options.items;
        this.range = new Circle(owner.position, options.radius);
        this.player = options.player;
        
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

    getRange(): Circle { return this.range; }

    getPlayerPosition(): Vec2 { return this.player.position; }

    getPlayerMoney(): number { return (<PlayerController>this.player._ai).getPlayerMoney(); }

    getStoreItems(): Record<string,any> { return this.items; }
    
    activate(options: Record<string, any>) {}  
    
    destroy(): void {}

}