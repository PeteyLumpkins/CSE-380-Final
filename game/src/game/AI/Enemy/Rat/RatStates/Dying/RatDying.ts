import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { RatAIEvents, RatAIStates } from "../../RatAI";
import RatState from "../RatState";

export default abstract class RatDying extends RatState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting the Rat Dying state!");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play(this.animation, false, RatAIEvents.RAT_DEAD);
        }
    }

    handleInput(event: GameEvent): void {
        switch (event.type) {
            case RatAIEvents.RAT_DEAD: {
                console.log("Got a rat dead state in rat dying state");
                this.finished(RatAIStates.DEAD)
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

import RatDyingLeft from "./RatDyingLeft";
import RatDyingRight from "./RatDyingRight";

export { RatDyingLeft, RatDyingRight }