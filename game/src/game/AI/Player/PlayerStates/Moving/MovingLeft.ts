import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../../PlayerController";
import Moving from "./Moving";

export default class MovingLeft extends Moving {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play("WALK_LEFT");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
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
        } else if (dir.y < 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } else if (dir.x > 0) {
            this.finished(PlayerStates.MOVING_RIGHT);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } 
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_LEFT);
    }

    onExit(): Record<string, any> {
        return
    }
    
}