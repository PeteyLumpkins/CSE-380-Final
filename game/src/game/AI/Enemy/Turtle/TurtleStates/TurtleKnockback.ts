import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import TurtleState from "./TurtleState";
import { TurtleAIStates } from "../TurtleAI";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";


export default class TurtleKnockback extends TurtleState {

    private playerPosition: Vec2;
    private knockbackPosition: Vec2;

    onEnter(options: Record<string, any>): void {
        this.playerPosition = this.parent.target.position;

        // Player -> target is direction we want to move
        this.knockbackPosition = this.playerPosition.dirTo(this.owner.position).mult(new Vec2(100, 100)).add(this.playerPosition); //turtles should take less knockback or somethign??

        console.log('Entering knockback state');
    }
    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.parent.knockbackCooldownTimer.isStopped()) {
            console.log('knockback ended');
            this.finished(TurtleAIStates.MOVE);
        }

        this.parent.knockback.performAction(deltaT, {
            "target": this.owner,
            "position": this.knockbackPosition
        }, () => {
            if (this.owner.position.distanceTo(this.knockbackPosition) < 10) {
                this.finished(TurtleAIStates.MOVE);
            }
        });
    }

    onExit(): Record<string, any> { return; }
    
}