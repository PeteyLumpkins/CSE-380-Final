import Punch from "./Punch";

import { PlayerStates } from "../../PlayerController";

export default class PunchUp extends Punch {

    public static readonly animationKey = "PUNCH_UP"

    onEnter(options: Record<string, any>): void {
        /** Set animation name */
        this.animation = PunchUp.animationKey;

        /** Set the hitbox */
        this.hitbox = this.parent.getUpHitbox();

        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    onExit(): Record<string, any> {
        return;
    }
}