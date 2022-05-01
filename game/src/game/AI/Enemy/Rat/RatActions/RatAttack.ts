import StateMachineGoapAI from "../../../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import EnemyAI from "../../EnemyAI";

import { EnemyActions } from "../../../../GameEnums";

export default class RatAttackAction extends GoapAction {
    protected emitter: Emitter;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;

        this.emitter = new Emitter();
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        //Check if preconditions are met for this action to be performed
        if (this.checkPreconditions(statuses)){
            this.emitter.fireEvent(EnemyActions.ATTACK, {amount: 1});
            return this.effects;
        }
        return null;
    }


    updateCost(options: Record<string, number>): void {}
    
    toString(): string {
        return EnemyActions.ATTACK;
    }
    
}