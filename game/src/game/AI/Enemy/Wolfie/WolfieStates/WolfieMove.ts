import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../../../../Wolfie2D/Pathfinding/NavigationPath";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";



export default class WolfieMove extends WolfieState {

    onEnter(options: Record<string, any>): void {
        console.log("Starting wolfie move state");
        this.parent.moveTimer.start();
        if (this.owner instanceof AnimatedSprite) {
            this.owner.animation.play("move");
        }
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.parent.moveTimer.isStopped()) {
            console.log("Starting wolfie vulnerable state");
            this.finished(WolfieAIStates.VULNERABLE);
        }

        if (this.inAttackRange(this.parent.target.position)) {
            console.log("Starting wolfie attack");
            this.finished(WolfieAIStates.ATTACK);
        }

        this.parent.moveAction.performAction(deltaT, {
            "target": this.owner,
            "position": this.parent.target.position
        }, ()=>{});
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}