import RatHit from "./RatHit";
import { RatAIStates } from "../../RatAI";

export default class RatHitLeft extends RatHit {

    public static readonly ANIMATION = "HurtLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = RatHitLeft.ANIMATION;
        super.onEnter(options);
    }

    move(): void {
        this.finished(RatAIStates.MOVE_LEFT);
    }

    die(): void {
        this.finished(RatAIStates.DYING_LEFT);
    }

    takeDamage(): void {
        console.log("Taking damage in hit left state!");
        this.finished(RatAIStates.HURT_RIGHT);
    }
}