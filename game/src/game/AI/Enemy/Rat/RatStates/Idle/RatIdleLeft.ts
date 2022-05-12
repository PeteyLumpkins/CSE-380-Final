import RatIdle from "./RatIdle";
import { RatAIStates } from "../../RatAI";

export default class RatIdleLeft extends RatIdle {

    public static readonly ANIMATION = "IDLE_LEFT";

    onEnter(options: Record<string, any>): void {
        this.animation = RatIdleLeft.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_LEFT);
    }
}