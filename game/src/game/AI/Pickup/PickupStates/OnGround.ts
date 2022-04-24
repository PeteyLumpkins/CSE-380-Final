import State from "../../../../Wolfie2D/DataTypes/State/State";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PickupState from "./PickupState";

import { PickupStates } from "../PickupAI";

export default class OnGround extends PickupState {

    onEnter(): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("IDLE");
        }
    }

    handleInput(): void {}

    update(deltaT: number): void {
        if (this.parent.canPickup()) {
            this.finished(PickupStates.CAN_PICKUP);
        }
    }

    onExit(): Record<string, any> { return {}; }


}