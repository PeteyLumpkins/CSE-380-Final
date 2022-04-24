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
        
        console.log(event.data.get("position"));
        // If we're within the swarm range of the rat that saw the player -> make active
        if (this.inSwarmRange(event.data.get("position"))) {
            this.finished(RatAIStates.ACTIVE);
        }
    }

    update(deltaT: number): void {

        super.update(deltaT);

        // If we're in range of the player - rat becomes active
        if (this.inSightRange(this.parent.player.node.position)) {
            this.finished(RatAIStates.ACTIVE);
        }
    }

    onExit(): Record<string, any> {
        return;
    }

}