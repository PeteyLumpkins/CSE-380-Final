import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchDown extends Punch {

    public static readonly animationKey = "PUNCH_DOWN";

    onEnter(options: Record<string, any>): void {
        /** Initialize animation name */
        this.animation = PunchDown.animationKey;
        
        /** Initialize the hitbox */
        this.hitbox = this.parent.getDownHitbox();

        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_DOWN);
    }

    onExit(): Record<string, any> {
        return;
    }
}