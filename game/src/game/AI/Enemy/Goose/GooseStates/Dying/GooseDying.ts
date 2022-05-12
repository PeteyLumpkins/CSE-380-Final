import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIEvents, GooseAIStates} from "../../GooseAI";
import GooseState from "../GooseState";

export default abstract class GooseDying extends GooseState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting a goose dying animation");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play(this.animation, false, GooseAIEvents.DYING_OVER)
        }
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case GooseAIEvents.DYING_OVER: {
                this.finished(GooseAIStates.DEAD);
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void { super.update(deltaT); }

    onExit(): Record<string, any> { return super.onExit(); }
}

import GooseDyingLeft from "./GooseDyingLeft"
import GooseDyingRight from "./GooseDyingLeft"

export { GooseDyingLeft, GooseDyingRight }