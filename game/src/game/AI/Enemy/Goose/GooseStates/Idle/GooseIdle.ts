import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";

import GooseState from "../GooseState";
import { GooseAIEvents, GooseAIStates } from "../../GooseAI"

export default abstract class GooseIdle extends GooseState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting a goose idle state");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready(this.animation);
        }
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
}

import NormalGooseIdle from "./NormalGooseIdle";
import DemonGooseIdle from "./DemonGooseIdle";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export { NormalGooseIdle, DemonGooseIdle }