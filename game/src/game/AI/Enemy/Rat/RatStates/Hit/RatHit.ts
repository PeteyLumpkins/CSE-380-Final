import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { RatAIEvents, RatAIStates } from "../../RatAI";
import RatState from "../RatState";

export default abstract class RatHit extends RatState {

    private knockbackPosition: Vec2;

    onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ratDamaged", loop: false, holdReference: true})
        this.knockbackPosition = this.parent.target.position.dirTo(this.owner.position).mult(new Vec2(100, 100)).add(this.parent.target.position);
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play(this.animation, false, RatAIEvents.RAT_HIT_OVER);
        }
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case RatAIEvents.RAT_HIT_OVER: {
                this.handleRatHitOver();
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void {
        this.parent.knockback.performAction(deltaT, {
            "target": this.owner,
            "position": this.knockbackPosition
        }, ()=>{});
    }

    onExit(): Record<string, any> { return; }

    handleRatHitOver(): void { 
        if (this.isDead()) {
            console.log("Playing rat dying animation");
            this.die();
        } else {
            this.move();
        }
    }

    abstract move(): void;

    abstract die(): void;

}

import RatHitLeft from "./RatHitLeft";
import RatHitRight from "./RatHitRight";

export { RatHitLeft, RatHitRight }