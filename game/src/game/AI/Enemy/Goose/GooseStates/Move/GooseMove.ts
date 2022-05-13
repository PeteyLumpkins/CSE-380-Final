import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GooseState from "../GooseState"

export default abstract class GooseMove extends GooseState {

    onEnter(options: Record<string, any>): void {
        console.log("Goose started a moving state!");
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

        if (this.inAttackRange(this.parent.target.position)) {
            this.attack();
        } 

        this.parent.moveAction.performAction(deltaT, {
            "target": this.owner,
            "position": this.parent.target.position
        }, ()=>{});
    }
    onExit(): Record<string, any> { return; }

    abstract attack(): void;

}

import GooseMoveLeft from "./GooseMoveLeft";
import GooseMoveRight from "./GooseMoveRight";

export { GooseMoveLeft, GooseMoveRight }
