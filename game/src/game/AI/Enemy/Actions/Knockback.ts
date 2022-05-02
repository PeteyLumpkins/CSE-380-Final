import StateMachineGoapAI from "../../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Emitter from "../../../../Wolfie2D/Events/Emitter";

import EnemyAI from "../EnemyAI";
import { EnemyActions } from "../../../GameEnums";

export default class AttackAction extends GoapAction {
    
    protected emitter: Emitter;

    /** The speed that the actor should be knocked back from the target */
    protected speed: number;

    /** The distance used to calculate where the actor should be knocked back to */
    protected distance: number;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;

        this.emitter = new Emitter();

        this.speed = options.speed;
        this.distance = options.distance;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        // Check if preconditions are met for this action to be performed
        if (this.checkPreconditions(statuses)) {
            
            let enemy = (<EnemyAI>actor).owner;
            let target = (<EnemyAI>actor).target;
            let path = enemy.getScene().getNavigationManager().getPath('navmesh', enemy.position, target.position, true);

            // Rotates the direction 180 degrees
            let dir = path.getMoveDirection(target).rotateCCW(Math.PI);

            

            return this.effects;
        }
        return null;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string { return EnemyActions.ATTACK; }
}