import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { WolfieAIEvent, WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";


export default class WolfieCharge extends WolfieState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready("charging", false, WolfieAIEvent.ATTACKED)
        }
    }

    update(deltaT: number): void {
        super.update(deltaT);
    }

    handleInput(event: GameEvent): void {
        switch (event.type) {
            case WolfieAIEvent.ATTACKED: {
                console.log("Wolfie attacked -> transitioning to move");
                this.parent.attackAction.performAction(0, {}, ()=>{});
                this.finished(WolfieAIStates.MOVE);
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    onExit(): Record<string, any> { 
        return;
    }

}