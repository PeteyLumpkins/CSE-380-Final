import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";



export default class WolfieIdle extends WolfieState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("idle");
        }
        console.log("Entering the wolfie idle state");
    }

    handleInput(event: GameEvent): void { 

        switch (event.type) {

            case WolfieAIStates.PLAYER_SEEN: {
                this.handlePlayerSeenEvent(event);
                break;
            }
            default: {
                console.log("Unknown event caught in RatIdle state");
                break;
            }
        }
    }

    handlePlayerSeenEvent(event: GameEvent): void {
        console.log("Handlign a player seen event");
    }

    update(deltaT: number): void {
        super.update(deltaT);

        // If we're in range of the player - rat should start trying to move toward the player
        // if (this.inSightRange(this.parent.target.position)) {
        //     this.finished(WolfieAIStates.MOVE);
        // }
    }

    onExit(): Record<string, any> { return; }

}