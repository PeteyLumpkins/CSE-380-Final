import { PlayerStates } from "../../PlayerController";
import Hurt from "./Hurt";

export default class HurtDown extends Hurt {
    public static readonly ANIMATION = "HURT_DOWN"

    onEnter(options: Record<string, any>): void {
        this.animation = HurtDown.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_DOWN);
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_DOWN);
    }
}