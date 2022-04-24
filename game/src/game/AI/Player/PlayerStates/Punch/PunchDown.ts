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

    attack(dir: Vec2): void {

        if (!this.attackTimer.isStopped()) {
            return;
        }

        if (dir.x > 0) {
            this.finished(PlayerStates.PUNCH_RIGHT);
        } else if (dir.x < 0) {
            this.finished(PlayerStates.PUNCH_LEFT);
        } else if (dir.y < 0) {
            this.finished(PlayerStates.PUNCH_UP);
        } else { 
            this.finished(PlayerStates.PUNCH_DOWN);
        }
    }

    onExit(): Record<string, any> {
        return
    }
}