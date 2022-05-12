import RatHit from "./RatHit";
import { RatAIStates } from "../../RatAI";

export default class RatHitRight extends RatHit {

    public static readonly ANIMATION = "HurtRight";

    onEnter(options: Record<string, any>): void {
        this.animation = RatHitRight.ANIMATION;
        super.onEnter(options);
    }

    move(): void {
        this.finished(RatAIStates.MOVE_RIGHT);
    }

    die(): void {
        this.finished(RatAIStates.DYING_RIGHT);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_RIGHT);
    }
}