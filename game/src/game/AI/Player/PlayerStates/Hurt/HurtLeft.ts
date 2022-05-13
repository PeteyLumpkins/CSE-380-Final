import { PlayerStates } from "../../PlayerController";
import Hurt from "./Hurt";

export default class HurtLeft extends Hurt {
    public static readonly ANIMATION = "HURT_LEFT"

    onEnter(options: Record<string, any>): void {
        this.animation = HurtLeft.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_LEFT);
    }
}