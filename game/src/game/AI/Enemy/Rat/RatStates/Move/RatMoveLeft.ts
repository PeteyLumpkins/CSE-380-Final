import RatMove from "./RatMove";
import { RatAIStates } from "../../RatAI";

export default class RatMoveLeft extends RatMove {

    public static readonly ANIMATION = "WalkLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = RatMoveLeft.ANIMATION;
        super.onEnter(options);
    }

    attack(): void {
        this.finished(RatAIStates.ATTACK_LEFT);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_LEFT);
    }
}