import GoapAction from "../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import StateMachineGoapAI from "../../../../Wolfie2D/AI/StateMachineGoapAI"
import EnemyAI from "../../../AI/Enemy/EnemyAI";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import { EnemyActions } from "../../../GameEnums";

export default class Move extends GoapAction {

    private path: NavigationPath;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        //Check if preconditions are met for this action to be performed
        if (this.checkPreconditions(statuses)){
            console.log("Enemy Moving");
            let enemy = <EnemyAI>actor;
            let distance = enemy.owner.position.distanceTo(enemy.player.position);

            // Trigger the attack action
            if (distance <= 10){
                console.log("In range of player");
                return this.effects;
            }

            this.path = enemy.owner.getScene().getNavigationManager().getPath("navmesh", enemy.owner.position, enemy.player.position, true)
            // enemy.owner.rotation = Vec2.UP.angleToCCW(this.path.getMoveDirection(enemy.owner));
            enemy.owner.moveOnPath(enemy.speed * deltaT, this.path);
            return null;
        }
        return this.effects;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string {
        return EnemyActions.MOVE;
    }

}