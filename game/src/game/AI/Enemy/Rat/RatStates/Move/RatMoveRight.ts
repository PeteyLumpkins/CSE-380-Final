import RatMove from "./RatMove";
import { RatAIStates } from "../../RatAI";

export default class RatMoveRight extends RatMove {

    public static readonly ANIMATION = "WalkRight";

    onEnter(options: Record<string, any>): void {
        this.animation = RatMoveRight.ANIMATION;
        super.onEnter(options);
    }

    attack(): void {
        this.finished(RatAIStates.ATTACK_RIGHT);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_RIGHT);
    }
}