import { PlayerEvents } from "../../Player/PlayerController";
import AttackAction, { AttackActionType } from "../Actions/AttackAction";
import GooseAI, { GooseAIStates } from "./GooseAI"

export default class DemonGooseAI extends GooseAI {

    initStates(): void {
        super.initStates();
        this.initialize(GooseAIStates.IDLE_DEMON);
    }

    initOptions(options: Record<string, any>): void {
        super.initOptions(options);
        this.attackAction = AttackAction.attackActionBuilder(AttackActionType.DEMON_GOOSE, this.owner);
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }
    
}