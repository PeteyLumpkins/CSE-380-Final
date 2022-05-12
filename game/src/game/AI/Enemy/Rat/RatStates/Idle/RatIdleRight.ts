import RatIdle from "./RatIdle";
import { RatAIStates } from "../../RatAI";

export default class RatIdleRight extends RatIdle {

    public static readonly ANIMATION = "IDLE_RIGHT";

    onEnter(options: Record<string, any>): void {
        this.animation = RatIdleRight.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_LEFT);
    }
}