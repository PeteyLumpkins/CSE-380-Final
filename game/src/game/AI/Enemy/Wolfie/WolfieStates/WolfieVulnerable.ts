import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerEvents } from "../../../Player/PlayerController";
import { WolfieAIEvent, WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";



export default class WolfieVulnerable extends WolfieState {

    onEnter(options: Record<string, any>): void {
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready("vulnerable");
            this.parent.vulnerableTimer.start();
        }
        console.log("Entering the wolfie vulnerable state");
    }

    handleInput(event: GameEvent): void {
        switch (event.type) {
            case PlayerEvents.ATTACKED: {
                if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
                    this.parent.health -= event.data.get("damage") * 10;
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
                    if (this.isDead()) {
                        this.finished(WolfieAIStates.DEAD);
                    }
                }
                break;
            }
            case WolfieAIEvent.VULNERABLE_ENDED: {
                this.finished(WolfieAIStates.MOVE);
                break;  
            }   
            default: {
                super.handleInput(event);
                break;
            }
        }
     }

    update(deltaT: number): void {
        super.update(deltaT);
    }

    onExit(): Record<string, any> { return; }

}