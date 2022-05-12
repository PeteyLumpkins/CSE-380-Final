import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../../Wolfie2D/Events/GameEventType";
import RatState from "../RatState";

export default abstract class RatAttack extends RatState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting rat attack");
    }

    update(deltaT: number): void {
        if (this.parent.attackCooldownTimer.isStopped()) {
            this.parent.attack.performAction(deltaT, {}, ()=>{});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ratAttack", loop: false, holdReference: true})
            this.parent.attackCooldownTimer.start();
        }
        this.idle();
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    abstract idle(): void;

    onExit(): Record<string, any> { return; }

}

import RatAttackLeft from "./RatAttackLeft";
import RatAttackRight from "./RatAttackRight";

export { RatAttackLeft, RatAttackRight }