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

    attack(dir: Vec2): void {

        if (!this.attackTimer.isStopped()) {
            return;
        }
        
        if (dir.x < 0) {
            this.finished(PlayerStates.PUNCH_LEFT);
        } else if (dir.x > 0) {
            this.finished(PlayerStates.PUNCH_RIGHT);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.PUNCH_DOWN);
        } else {
            this.finished(PlayerStates.PUNCH_UP);
        }
    }

    onExit(): Record<string, any> {
        return
    }
}