import { PlayerEvents } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class Dying extends PlayerState {
    
    public static readonly ANIMATION = "DYING";

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play(Dying.ANIMATION, false, PlayerEvents.PLAYER_DIED);
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }

    takeDamage(): void {}
    
}