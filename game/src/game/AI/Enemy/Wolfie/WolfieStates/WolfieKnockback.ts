import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";




export default class WolfieKnockback extends WolfieState {

    private playerPosition: Vec2;
    private knockbackPosition: Vec2;

    onEnter(options: Record<string, any>): void {
        this.playerPosition = this.parent.target.position;

        // Player -> target is direction we want to move
        this.knockbackPosition = this.parent.target.position.dirTo(this.owner.position).mult(new Vec2(100, 100)).add(this.parent.target.position);

        console.log('Entering knockback state');
    }
    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.parent.knockbackCooldownTimer.isStopped()) {
            console.log('knockback ended');
            this.finished(WolfieAIStates.IDLE);
        }

        this.parent.knockbackAction.performAction(deltaT, {
            "target": this.owner,
            "position": this.knockbackPosition
        }, () => {
        });
    }

    onExit(): Record<string, any> { return; }
    
}