import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchUp extends Punch {

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.owner.animation.play("PUNCH_UP");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    onExit(): Record<string, any> {
        return;
    }
}