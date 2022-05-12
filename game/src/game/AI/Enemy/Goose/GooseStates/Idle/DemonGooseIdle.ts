import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import { GooseAIEvents, GooseAIStates } from "../../GooseAI";
import GooseIdle from "./GooseIdle";

export default class DemonGooseIdle extends GooseIdle {

    public static readonly ANIMATION = "idle_aggro";

    onEnter(options: Record<string, any>): void {
        this.animation = DemonGooseIdle.ANIMATION;
        super.onEnter(options);
    }

    handleInput(event: GameEvent) {
        switch(event.type) {
            case GooseAIEvents.PLAYER_SEEN: {
                this.handlePlayerSeenEvent(event);
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void {
        if (this.inSightRange(this.parent.target.position)) {
            this.emitter.fireEvent(GooseAIEvents.PLAYER_SEEN);
        }
    }

    onExit(): Record<string, any> { return super.onExit(); }

    handlePlayerSeenEvent(event: GameEvent): void {
        let dir = this.owner.position.dirTo(this.parent.target.position);
        if (dir.x > 0) {
            this.finished(GooseAIStates.MOVE_RIGHT);
        } else {
            this.finished(GooseAIStates.MOVE_LEFT);
        }
    }

    takeDamage(): void { 
        this.finished(GooseAIStates.HIT_LEFT);
    }
}
