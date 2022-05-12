import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import { GooseAIStates } from "../../GooseAI";
import GooseHit from "./GooseHit";

export default class GooseHitRight extends GooseHit {

    public static readonly ANIMATION = "hurtRight";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseHitRight.ANIMATION;
        super.onEnter(options);
    }

    handleEvent(event: GameEvent): void {}

    move(): void {
        this.finished(GooseAIStates.MOVE_RIGHT);
    }
    die(): void {
        this.finished(GooseAIStates.DYING_RIGHT);
    }
    takeDamage(): void {
        this.finished(GooseAIStates.HIT_RIGHT);
    }
}