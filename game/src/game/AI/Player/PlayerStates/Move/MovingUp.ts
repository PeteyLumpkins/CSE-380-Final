import { PlayerStates } from "../../PlayerController";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Moving from "./Moving";

export default class MovingUp extends Moving {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play("WALK_UP");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    move(dir: Vec2): void {
        if (dir.x > 0 && dir.y > 0) {
            // Up-right?
        } else if (dir.x > 0 && dir.y < 0) {
            // Down-right?
        } else if (dir.x < 0 && dir.y > 0) {
            // Up-left?
        } else if (dir.x < 0 && dir.y < 0) {
            // Down-left?
        } else if (dir.x < 0) {
            this.finished(PlayerStates.MOVING_LEFT);
        } else if (dir.x > 0) {
            this.finished(PlayerStates.MOVING_RIGHT);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } 
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_UP);
    }

    onExit(): Record<string, any> {
        return;
    }
    
}