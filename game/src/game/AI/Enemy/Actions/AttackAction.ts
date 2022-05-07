import Emitter from "../../../../Wolfie2D/Events/Emitter";

import { EnemyActions } from "../../../GameEnums";
import EnemyAction from "./EnemyAction";

export enum AttackActionType {
    RAT = "RAT_ATTACK"
}

/**
 * The AttackAction for an EnemyAI - fires an EnemyAttack event that gets picked up by the player
 * 
 * The attack should also send a payload with any data that affects the player. So stuff like
 * how much damage to deal, what type of enemy is attacked, etc. 
 */
export default class AttackAction implements EnemyAction {

    private attackData: Record<string, any>;
    private emitter: Emitter;

    constructor(attackData: Record<string, any>) {
        this.attackData = attackData;
        this.emitter = new Emitter();
    }

    /**
     * Performs the attack action, whatever it is
     * 
     * @param deltaT change in time since the last movement
     * @param options any options needed to perform the action
     * @param effects callback function that gets called after the action is performed
     */
    performAction(deltaT: number, options: Record<string, any>, effects: Function): void {
        this.emitter.fireEvent(EnemyActions.ATTACK, this.attackData);
        effects();
    }

    /**
     * 
     * @param type The type of the attack action that we want
     * @returns a new AttackAction object for the given AttackActionType
     */
    public static attackActionBuilder(type: AttackActionType): AttackAction {

        let opt = {};
        switch(type) {
            case AttackActionType.RAT: {
                opt = {
                    type: AttackActionType.RAT,
                    amount: 1
                }
                break;
            }
            default: {
                throw new Error("Unknown attack action type");
            }
        }

        return new AttackAction(opt);
    }
    
}