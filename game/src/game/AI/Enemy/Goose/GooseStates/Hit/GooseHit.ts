import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import GooseState from "../GooseState";
import {GooseAIEvents, GooseAIStates} from "../../GooseAI";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

export default abstract class GooseHit extends GooseState {

    private knockbackPosition: Vec2;

    /** STATE METHODS */
    onEnter(options: Record<string, any>): void {
        console.log("Starting a goose hit state!");

        this.knockbackPosition = this.parent.target.position.dirTo(this.owner.position).mult(new Vec2(100, 100)).add(this.parent.target.position);

        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready(this.animation, false, GooseAIEvents.HIT_OVER);
        }
    }
    handleInput(event: GameEvent): void {
        switch(event.type) {
            case GooseAIEvents.HIT_OVER: {
                this.handleHitOverEvent();
                break;
            }
            default: {
                super.handleInput(event);
                break
            }
        }
    }
    update(deltaT: number): void {
        this.parent.knockbackAction.performAction(deltaT, {
            "target": this.owner,
            "position": this.knockbackPosition
        }, ()=>{});
    }
    onExit(): Record<string, any> { return; }

    /** CUSTOM METHODS */
    handleHitOverEvent(): void {

        if (this.isDead()) {
            this.finished(GooseAIStates.DEAD);
        } else {
            this.move();
        }
    }
    abstract move(): void;
    abstract die(): void;
}

import GooseHitLeft from "./GooseHitLeft";
import GooseHitRight from "./GooseHitRight";

export { GooseHitLeft, GooseHitRight }