import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";

export enum GooseAIStates {
    IDLE = "GOOSE_IDLE_STATE",
    MOVE = "GOOSE_MOVING_STATE",
    ATTACK = "GOOSE_ATTACKING_STATE",
    KNOCK_BACK = "GOOSE_KNOCKED_BACK_STATE",
    DEAD = "GOOSE_DEAD_STATE"
}

export default class GooseAI extends EnemyAI {

    /** Goose stats/options should go here */


    initStates(): void {
        
    }

    initOptions(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }
    
}