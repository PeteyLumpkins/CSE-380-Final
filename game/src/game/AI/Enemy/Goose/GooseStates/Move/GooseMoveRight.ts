import { GooseAIStates } from "../../GooseAI";
import GooseMove from "./GooseMove";

export default class GooseMoveLeft extends GooseMove {

    public static readonly ANIMATION = "WalkRight";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseMoveLeft.ANIMATION;
        super.onEnter(options);
    }

    attack(): void {
        this.finished(GooseAIStates.ATTACK_RIGHT);
    }
    takeDamage(): void {
        this.finished(GooseAIStates.HIT_RIGHT);
    }

}