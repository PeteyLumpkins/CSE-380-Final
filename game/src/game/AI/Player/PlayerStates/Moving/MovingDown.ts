import { PlayerStates } from "../../PlayerController";
import Moving from "./Moving";

export default class MovingDown extends Moving {

    public static readonly ANIMATION = "WALK_DOWN";

    onEnter(options: Record<string, any>): void {
        this.animation = MovingDown.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_DOWN);
    }

    attack(): void {
        this.finished(PlayerStates.PUNCH_DOWN);
    }  
}