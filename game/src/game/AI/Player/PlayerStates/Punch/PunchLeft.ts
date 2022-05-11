import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchLeft extends Punch {

    public static readonly animationKey = "PUNCH_LEFT"

    onEnter(options: Record<string, any>): void {
        /** Set the animation name */
        this.animation = PunchLeft.animationKey;
        
        /** Set the hitbox */
        this.hitbox = this.parent.getLeftHitbox();

        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
    }

    onExit(): Record<string, any> {
        return;
    }
}