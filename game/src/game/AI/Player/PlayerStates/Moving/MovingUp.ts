import { PlayerStates } from "../../PlayerController";
import Moving from "./Moving";

export default class MovingUp extends Moving {

    public static readonly ANIMATION = "WALK_UP";

    onEnter(options: Record<string, any>): void {
        this.animation = MovingUp.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_UP);
    } 
}