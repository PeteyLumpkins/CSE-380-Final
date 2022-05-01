import Punch from "./Punch";

import { PlayerStates } from "../../PlayerController";

export default class PunchUp extends Punch {

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.attackType = PlayerStates.PUNCH_UP;
        this.owner.animation.play("PUNCH_UP");
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    onExit(): Record<string, any> {
        return;
    }
}