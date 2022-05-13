import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIEvents, GooseAIStates } from "../../GooseAI";
import GooseState from "../GooseState";

export default abstract class GooseAttack extends GooseState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting a goose attack");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready(this.animation, false, GooseAIEvents.ATTACK_FINISHED);
        }
    }
    handleInput(event: GameEvent): void {
        switch(event.type) {
            case GooseAIEvents.ATTACK_FINISHED: {
                this.handleAttackFinished();
                break;
            }
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

    handleAttackFinished(): void { 
        console.log("Finishing goose attack");
        this.parent.attackAction.performAction(0, {}, ()=>{});
        this.finished(GooseAIStates.IDLE)
    }
}

import GooseAttackLeft from "./GooseAttackLeft";
import GooseAttackRight from "./GooseAttackRight";

export { GooseAttackRight, GooseAttackLeft } 