import Idle from "./Idle";


export default class IdleRight extends Idle {

    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("IDLE_UP");
	}

    onExit(): Record<string, any> {
		return {};
	}
}