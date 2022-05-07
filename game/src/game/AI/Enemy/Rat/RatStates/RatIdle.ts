import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Receiver from "../../../../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import RatAI from "../RatAI";
import RatState from "./RatState";
import { RatAIStates, RatAIEvents } from "../RatAI";

export default class RatIdle extends RatState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("WalkRight");
        }
        console.log("Entering the rat idle state");
    }

    handleInput(event: GameEvent): void { 

        switch (event.type) {

            case RatAIEvents.PLAYER_SEEN: {
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
        if (this.inSightRange(this.parent.target.position)) {
            this.finished(RatAIStates.MOVE);
        }
    }

    onExit(): Record<string, any> { return; }

}