import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerEvents } from "../../../Player/PlayerController";
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
            case PlayerEvents.ATTACKED: {
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                break;
            }
        }
    }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.finished(WolfieAIStates.TRANSFORM);
        }
    }

    update(deltaT: number): void {
        super.update(deltaT);
    }

    onExit(): Record<string, any> { return; }

}