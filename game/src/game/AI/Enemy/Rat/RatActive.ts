import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


import RatState from "./RatState";
import { RatStates, RatEvents } from "./RatAI";


export default class RatActive extends RatState {

    onEnter(options: Record<string, any>): void {
        console.log("firing player seen event");
        this.emitter.fireEvent(RatEvents.PLAYER_SEEN, {position: this.owner.position});
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {

        super.update(deltaT);

        /** Perform actions next */
        let nextAction = this.parent.plan.peek();

        let result = nextAction.performAction(this.parent.currentStatus, this.parent, deltaT);
       
        if (result !== null) {
            this.parent.plan.pop()
        } 
        
        else if (!nextAction.loopAction) {
            this.parent.plan.pop();
        }
    }

    onExit(): Record<string, any> {
        return;
    }

}