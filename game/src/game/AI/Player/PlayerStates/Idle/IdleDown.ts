import Idle from "./Idle";
import { PlayerStates } from "../../PlayerController";


export default class IdleDown extends Idle {

    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("IDLE_DOWN");
	}

	attack(): void {
		this.finished(PlayerStates.PUNCH_DOWN);
	}

    onExit(): Record<string, any> {
		return {};
	}
}