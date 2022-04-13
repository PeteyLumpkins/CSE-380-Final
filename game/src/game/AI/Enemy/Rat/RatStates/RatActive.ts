import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


import RatState from "./RatState";
import { RatAIStates, RatAIStatuses, RatAIEvents } from "../RatAI";


export default class RatActive extends RatState {

    onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(RatAIEvents.PLAYER_SEEN, {position: this.owner.position});
    }

    handleInput(event: GameEvent): void {
        super.handleInput(event);
     }

    update(deltaT: number): void {

        super.update(deltaT);

        if (!this.inAttackRange(this.parent.player.position)) {
            let i = this.parent.currentStatus.indexOf(RatAIStatuses.IN_RANGE);
            if (i != -1) {
                this.parent.currentStatus.splice(i, 1);
            }
        } 

        /** Perform actions next */
        let nextAction = this.parent.plan.peek();

        let result = nextAction.performAction(this.parent.currentStatus, this.parent, deltaT);
       
        if (result !== null) {
            this.parent.plan.pop()

            // Adds statuses to the current status of the
            if (!result.includes(RatAIStatuses.GOAL_REACHED)) {
                this.parent.currentStatus = this.parent.currentStatus.concat(...result);
            }
        } 
        
        else if (!nextAction.loopAction) {
            this.parent.plan.pop();
        }
    }

    onExit(): Record<string, any> {
        return;
    }

}