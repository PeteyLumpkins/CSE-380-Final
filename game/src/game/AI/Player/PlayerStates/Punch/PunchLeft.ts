import Punch from "./Punch";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerStates } from "../../PlayerController";

export default class PunchLeft extends Punch {

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.owner.animation.play("PUNCH_LEFT");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
    }

    attack(dir: Vec2): void {

        if (!this.attackTimer.isStopped()) {
            return;
        }
        
        if (dir.x > 0) {
            this.finished(PlayerStates.PUNCH_RIGHT);
        } else if (dir.y < 0) {
            this.finished(PlayerStates.PUNCH_UP);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.PUNCH_DOWN);
        }
    }

    onExit(): Record<string, any> {
        return
    }
}