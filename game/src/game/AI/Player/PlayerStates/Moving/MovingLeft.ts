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

    attack(): void {
        this.finished(PlayerStates.PUNCH_LEFT);
    }
}