import Idle from "./Idle";
import { PlayerStates } from "../../PlayerController";

export default class IdleDown extends Idle {

	public static readonly ANIMATION = "IDLE_DOWN";

    onEnter(options: Record<string, any>): void {
		this.animation = IdleDown.ANIMATION;
		super.onEnter(options);
	}

	attack(): void {
		this.finished(PlayerStates.PUNCH_DOWN);
	}
	
}