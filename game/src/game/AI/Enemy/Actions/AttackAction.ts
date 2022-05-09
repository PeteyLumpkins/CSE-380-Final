import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";

import { EnemyActions } from "../../../GameEnums";
import EnemyAction from "./EnemyAction";

export enum AttackActionType {
    BLACK_RAT = "BLACK_RAT_ATTACK",
    WHITE_RAT = "WHITE_RAT_ATTACK",
    NORMAL_GOOSE = "NORMAL_GOOSE_ATTACK",
    DEMON_GOOSE = "DEMON_GOOSE_ATTACK",
    WOLFIE = "WOLFIE_ATTACK"
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
    public static attackActionBuilder(type: AttackActionType, attacker: GameNode): AttackAction {
        console.log("Hello from attac");
        let opt = {};
        switch(type) {
            case AttackActionType.BLACK_RAT: {
                opt = {
                    type: AttackActionType.BLACK_RAT,
                    damage: 1,
                    attacker: attacker,
                    attackRange: 40
                }
                break;
            }
            case AttackActionType.WHITE_RAT: {
                opt = {
                    type: AttackActionType.WHITE_RAT,
                    damage: 2, 
                    attacker: attacker,
                    attackRange: 40
                }
                break;
            }
            case AttackActionType.DEMON_GOOSE: {
                opt = {
                    type: AttackActionType.DEMON_GOOSE,
                    damage: 5,
                    attacker: attacker,
                    attackRange: 75
                }
                break;
            }
            case AttackActionType.WOLFIE: {
                console.log("wolfie");
                opt = {
                    type: AttackActionType.WOLFIE,
                    damage: 6,
                    attacker: attacker,
                    attackRange: 200
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