import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchRight extends Punch {

    public static readonly animationKey = "PUNCH_RIGHT"

    onEnter(options: Record<string, any>): void {
        /** Set animation name */
        this.animation = PunchRight.animationKey;

        /** Set the hitbox */
        this.hitbox = this.parent.getRightHitbox();

        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_RIGHT);
    }

    onExit(): Record<string, any> {
        return;
    }
}