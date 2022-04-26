import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchDown extends Punch {

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.owner.animation.play("PUNCH_DOWN");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_DOWN);
    }

    onExit(): Record<string, any> {
        return;
    }
}