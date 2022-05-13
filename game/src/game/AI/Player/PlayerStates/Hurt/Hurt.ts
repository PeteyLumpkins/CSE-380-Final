import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { PlayerEvents, PlayerStates } from "../../PlayerController";
import { PlayerStat } from "../../PlayerStats";
import PlayerState from "../PlayerState";

export default abstract class Hurt extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play(this.animation, false, PlayerEvents.HURT_ENDED)
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.HURT_ENDED: {
                this.handlePlayerHurtEvent();
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    handlePlayerHurtEvent(): void {
        if (this.parent.playerStats.getStat(PlayerStat.HEALTH) <= 0) {
            this.finished(PlayerStates.DYING);
        } else {
            this.idle();
        }

    }

    update(deltaT: number): void {

    }

    onExit(): Record<string, any> {
        return;
    }

    abstract idle(): void;
}

import HurtDown from "./HurtDown";
import HurtLeft from "./HurtLeft";
import HurtRight from "./HurtRight";
import HurtUp from "./HurtUp";

export { HurtDown, HurtLeft, HurtRight, HurtUp }