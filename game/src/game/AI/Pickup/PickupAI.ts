import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import Scene from "../../../Wolfie2D/Scene/Scene";

import OnGround from "../Pickup/PickupStates/OnGround";
import CanPickup from "./PickupStates/CanPickup";
import PickedUp from "../Pickup/PickupStates/PickedUp";

import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { GameEvents } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export enum PickupStates {
    ON_GROUND = "PICKUP_ON_GROUND",
    CAN_PICKUP = "PICKUP_CAN_PICKUP",
    PICKED_UP = "PICKUP_PICKED_UP"
}

export default class PickupAI extends StateMachineAI {

    protected owner: GameNode;
    
    canPickup: Function;
    pickup: Function;
    data: Record<string, any>;

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

        this.canPickup = options.canPickup;
        this.pickup = options.pickup;
        
        this.data = options.data;
        this.emitter = new Emitter();

        this.addState(PickupStates.ON_GROUND, new OnGround(this, this.owner));
        this.addState(PickupStates.PICKED_UP, new PickedUp(this, this.owner));
        this.addState(PickupStates.CAN_PICKUP, new CanPickup(this, this.owner));
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

    destroy(): void {}

    /** Activates this AI from a stopped state and allows variables to be passed in */
    activate(options: Record<string, any>): void {}

    update(deltaT: number): void {
        super.update(deltaT);
    }

    /** Handles events from the Actor */
    handleEvent(event: GameEvent): void {}

}