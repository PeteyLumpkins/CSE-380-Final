import { PlayerStates } from "../../PlayerController";
import Hurt from "./Hurt";

export default class HurtRight extends Hurt {
    public static readonly ANIMATION = "HURT_RIGHT"

    onEnter(options: Record<string, any>): void {
        this.animation = HurtRight.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_RIGHT);
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_RIGHT);
    }
}