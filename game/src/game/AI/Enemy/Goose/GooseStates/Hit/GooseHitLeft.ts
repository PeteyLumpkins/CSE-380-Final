import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import { GooseAIStates } from "../../GooseAI";
import GooseHit from "./GooseHit";

export default class GooseHitLeft extends GooseHit {

    public static readonly ANIMATION = "hurtLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseHitLeft.ANIMATION;
        super.onEnter(options);
    }
    handleEvent(event: GameEvent): void {}

    move(): void {
        this.finished(GooseAIStates.MOVE_LEFT);
    }
    die(): void {
        this.finished(GooseAIStates.DYING_LEFT);
    }
    takeDamage(): void {
        this.finished(GooseAIStates.HIT_LEFT);
    }
}