import { PlayerEvents } from "../../Player/PlayerController";
import AttackAction, { AttackActionType } from "../Actions/AttackAction";
import GooseAI, { GooseAIStates } from "./GooseAI"
import { DemonGooseIdle } from "./GooseStates/GooseState";

export default class DemonGooseAI extends GooseAI {

    initStates(): void {
        super.initStates();

        this.addState(GooseAIStates.IDLE, new DemonGooseIdle(this, this.owner))
        this.initialize(GooseAIStates.IDLE);
    }

    initOptions(options: Record<string, any>): void {
        super.initOptions(options);
        this.attackAction = AttackAction.attackActionBuilder(AttackActionType.DEMON_GOOSE, this.owner);
    }

    subscribeToEvents(): void {
        super.subscribeToEvents();
    }
    
}