import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import { GooseAIStates } from "../../GooseAI";
import GooseAttack from "./GooseAttack";

export default class GooseAttackLeft extends GooseAttack {

    public static readonly ANIMATION = "attackLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = GooseAttackLeft.ANIMATION;
        super.onEnter(options);
    }
    handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }
    update(deltaT: number): void { 
        super.update(deltaT); 
    }
    onExit(): Record<string, any> { 
        return super.onExit(); 
    }

    takeDamage(): void {
        this.finished(GooseAIStates.HIT_LEFT);
    }
}