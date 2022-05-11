import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../../PlayerController";
import Moving from "./Moving";


export default class MovingLeft extends Moving {

    public static readonly ANIMATION = "WALK_LEFT";

    onEnter(options: Record<string, any>): void {
        this.animation = MovingLeft.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
    }

    move(dir: Vec2): void {
        if (dir.y < 0 && dir.x == 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } else if (dir.x > 0 && dir.y == 0) {
            this.finished(PlayerStates.MOVING_RIGHT);
        } else if (dir.y > 0 && dir.x == 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } 
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_LEFT);
    }
    
}