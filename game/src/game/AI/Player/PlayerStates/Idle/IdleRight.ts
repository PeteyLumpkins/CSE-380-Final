import Idle from "./Idle";
import { PlayerStates } from "../../PlayerController";


export default class IdleRight extends Idle {

    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("IDLE_RIGHT");
	}

	attack(): void {
		this.finished(PlayerStates.PUNCH_RIGHT);
	}

    onExit(): Record<string, any> {
		return {};
	}
}