import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import OnGround from "../Pickup/PickupStates/OnGround";
import PickedUp from "../Pickup/PickupStates/PickedUp";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { GameEvents } from "../../GameEnums";

export enum PickupStates {
    ON_GROUND = "PICKUP_ON_GROUND",
    PICKED_UP = "PICKUP_PICKED_UP"
}

export default class PickupAI extends StateMachineAI {

    protected owner: GameNode;
    protected player: GameNode;

    protected range: number;
    protected data: Record<string, any>;
    protected emitter: Emitter;

    /**
     * 
     * @param owner the GameNode that owns this pickup AI
     * @param options 
     *      {
     *          player: - the player GameNode
     *          range: - the range the player has to be within to pickup the item
     *          data: - {
     *                      type: - the type of the pickup
     *                  }
     *      }
     */
    initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;
        this.player = options.player;
        this.range = options.range;
        this.data = options.data;

        this.emitter = new Emitter();

        this.addState(PickupStates.ON_GROUND, new OnGround(this, this.owner));
        this.addState(PickupStates.PICKED_UP, new PickedUp(this, this.owner));
        this.initialize(PickupStates.ON_GROUND);

        owner.tweens.add("pickup", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
    }   

    getRange(): number { return this.range; }

    getPlayerPosition(): Vec2 { return this.player.position; }

    getData(): Record<string, any> { return this.data; }

    destroy(): void {
    }

    /** Activates this AI from a stopped state and allows variables to be passed in */
    activate(options: Record<string, any>): void {}

    update(deltaT: number): void {
        super.update(deltaT);
    }

    /** Handles events from the Actor */
    handleEvent(event: GameEvent): void {
    }

}