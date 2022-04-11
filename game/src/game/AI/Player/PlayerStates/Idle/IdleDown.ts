import Idle from "./Idle";


export default class IdleDown extends Idle {

    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("IDLE");
	}

    onExit(): Record<string, any> {
		return {};
	}
}