import RatAttack from "./RatAttack";
import { RatAIStates } from "../../RatAI";

export default class RatAttackRight extends RatAttack {

    public static readonly ANIMATION = "IDLE_RIGHT";

    onEnter(options: Record<string, any>): void {
        this.animation = RatAttackRight.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(RatAIStates.IDLE_RIGHT);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_RIGHT);
    }
}