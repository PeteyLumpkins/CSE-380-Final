import StateMachineGoapAI from "../../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { EnemyActions } from "../../../GameEnums";

export default class AttackAction extends GoapAction {
    
    protected emitter: Emitter;
    protected attackData: Record<string,any>;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;

        this.emitter = new Emitter();
        this.attackData = options;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        // Check if preconditions are met for this action to be performed
        if (this.checkPreconditions(statuses)) {
            this.emitter.fireEvent(EnemyActions.ATTACK, this.attackData);
            return this.effects;
        }
        return null;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string { return EnemyActions.ATTACK; }
}