import StateMachineGoapAI from "../../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../../Wolfie2D/DataTypes/Interfaces/GoapAction";

export default class MoveAction extends GoapAction {

    performAction(statuses: string[], actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): string[] {
        throw new Error("Method not implemented.");
    }
    updateCost(options: Record<string, number>): void {
        throw new Error("Method not implemented.");
    }
    toString(): string {
        throw new Error("Method not implemented.");
    }
    
}