import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchRight extends Punch {

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.owner.animation.play("PUNCH_RIGHT");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_RIGHT);
    }

    onExit(): Record<string, any> {
        return;
    }
}