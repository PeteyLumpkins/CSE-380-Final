import Idle from "./Idle";
import { PlayerStates } from "../../PlayerController";


export default class IdleRight extends Idle {

	public static readonly ANIMATION = "IDLE_UP";

    onEnter(options: Record<string, any>): void {
		this.animation = IdleRight.ANIMATION;
		super.onEnter(options);
	}

	attack(): void {
		this.finished(PlayerStates.PUNCH_UP);
	}

}