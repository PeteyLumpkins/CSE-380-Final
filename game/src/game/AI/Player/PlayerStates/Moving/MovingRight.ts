import { PlayerStates } from "../../PlayerController";
import Moving from "./Moving";

export default class MovingRight extends Moving {

    public static readonly ANIMATION = "WALK_RIGHT";

    onEnter(options: Record<string, any>): void {
        this.animation = MovingRight.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_RIGHT);
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_RIGHT);
    }
}