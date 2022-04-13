import AttackAction from "./Attack";

export default class RatAttackAction extends AttackAction {
    
    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super(cost, preconditions, effects, options);
    }

    attack(): void {

    }
    
}