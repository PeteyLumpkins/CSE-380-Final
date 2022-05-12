import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import RatState from "../RatState";
import { RatAIStates } from "../../RatAI";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default abstract class RatMove extends RatState {

    onEnter(options: Record<string, any>): void {
        console.log("Entering the rat move state");
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.playIfNotAlready(this.animation);
        }
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.inAttackRange(this.parent.target.position)) {
            this.attack();
        } 

        this.parent.move.performAction(deltaT, {
            "target": this.owner,
            "position": this.parent.target.position
        }, ()=>{});
    }

    abstract attack(): void;

    handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    onExit(): Record<string, any> { return; }

}

import RatMoveLeft from "./RatMoveLeft";
import RatMoveRight from "./RatMoveLeft";

export { RatMoveLeft, RatMoveRight }