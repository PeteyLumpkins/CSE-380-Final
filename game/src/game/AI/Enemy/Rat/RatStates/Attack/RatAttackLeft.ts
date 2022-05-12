import RatAttack from "./RatAttack";
import { RatAIStates } from "../../RatAI";

export default class RatAttackLeft extends RatAttack {

    public static readonly ANIMATION = "IDLE_LEFT";

    onEnter(options: Record<string, any>): void {
        this.animation = RatAttackLeft.ANIMATION;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(RatAIStates.IDLE_LEFT);
    }

    takeDamage(): void {
        this.finished(RatAIStates.HURT_LEFT);
    }
}