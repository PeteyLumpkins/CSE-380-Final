import Idle from "./Idle";
import { PlayerStates } from "../../PlayerController";


export default class IdleDown extends Idle {

	public static readonly animationKey = "IDLE_DOWN";

    onEnter(options: Record<string, any>): void {
		/** Set the animation we want to play */
		this.animation = IdleDown.animationKey;
		super.onEnter(options);
	}

	attack(): void {
		this.finished(PlayerStates.PUNCH_DOWN);
	}

    onExit(): Record<string, any> {
		return {};
	}
}