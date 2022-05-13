
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerEvents } from "../../../Player/PlayerController";
import WolfieAI, { WolfieAIStates, WolfieAIEvent } from "../WolfieAI";
import WolfieState from "./WolfieState";

export default class WolfieTransform extends WolfieState {

    onEnter(options: Record<string, any>): void {        
        console.log("Entering the wolfie transform state");
        this.parent.health = 200; // Refill on HP
        console.log(this.parent.health);
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready("transform", false, WolfieAIEvent.TRANSFORMED);
        }

    }
    handleInput(event: GameEvent): void {
        switch(event.type) {
            case WolfieAIEvent.TRANSFORMED: {
                console.log("Starting wolfie move state?");
                this.finished(WolfieAIStates.MOVE);
                break;
            }
            case PlayerEvents.ATTACKED: {
                // Do nothing - cannot take dmg while transforming
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }


}