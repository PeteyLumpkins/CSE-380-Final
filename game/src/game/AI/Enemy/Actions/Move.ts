import GoapAction from "../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import StateMachineGoapAI from "../../../../Wolfie2D/AI/StateMachineGoapAI"
import EnemyAI from "../Rat/RatAI";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";

import { EnemyActions } from "../../../GameEnums";

export default class MoveAction extends GoapAction {

    /** The speed that the actor should move toward the target */
    private speed: number;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;

        this.speed = options.speed;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        //Check if preconditions are met for this action to be performed
        if (this.checkPreconditions(statuses)){
            let enemy = (<EnemyAI>actor).owner;
            let target = (<EnemyAI>actor).target;
            let path = enemy.getScene().getNavigationManager().getPath("navmesh", enemy.position, target.position, true);
            enemy.moveOnPath(this.speed * deltaT, path);
            return this.effects;
        }
        return null;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string { return EnemyActions.MOVE; }
}