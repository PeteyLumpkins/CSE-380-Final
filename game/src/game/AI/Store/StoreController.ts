import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

import Disabled from "./StoreStates/Disabled";
import Enabled from "./StoreStates/Enabled";
import Open from "./StoreStates/Open";

import Player from "../../Player/Player";
import PlayerController from "../Player/PlayerController";

import {StoreEvents} from "../../GameEnums";

export enum StoreStates {
    DISABLED = "STORE_DISABLED",
    ENABLED = "STORE_ENABLED",
    OPEN = "STORE_OPEN"
}

export default class StoreController extends StateMachineAI {

    owner: AnimatedSprite;
    player: Player;
    target: GameNode;
    items: Array<string>;
    range: number;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        
        this.owner = owner;

        this.items = options.items;
        this.range = options.radius
        this.player = options.player;
        this.target = this.player.node;
        
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