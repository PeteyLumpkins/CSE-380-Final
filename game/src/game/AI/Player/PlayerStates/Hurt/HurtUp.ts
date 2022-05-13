import { PlayerStates } from "../../PlayerController";
import Hurt from "./Hurt";

export default class HurtUp extends Hurt {
    public static readonly ANIMATION = "HURT_UP";

    onEnter(options: Record<string, any>): void {
        this.animation = HurtUp.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_UP);
    }
}