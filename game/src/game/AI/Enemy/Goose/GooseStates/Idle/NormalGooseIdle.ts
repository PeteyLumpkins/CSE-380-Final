import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GooseAIEvents, GooseAIStates } from "../../GooseAI";
import GooseIdle from "./GooseIdle";

export default class NormalGooseIdle extends GooseIdle {

    public static readonly ANIMATION = "idle_not_aggro";

    onEnter(options: Record<string, any>): void {
        this.animation = NormalGooseIdle.ANIMATION;
        super.onEnter(options);
    }
    handleInput(event: GameEvent): void {
        switch (event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }
    update(deltaT: number): void {
        if (this.hasBeenHit()) {
            this.emitter.fireEvent(GooseAIEvents.TOOK_DAMAGE)
        }
    }
    onExit(): Record<string, any> { 
        return super.onExit(); 
    }

    takeDamage(): void { 
        this.finished(GooseAIStates.HIT_LEFT);
    }
}