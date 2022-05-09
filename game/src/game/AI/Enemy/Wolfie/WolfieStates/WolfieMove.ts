import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../../../../Wolfie2D/Pathfinding/NavigationPath";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";



export default class WolfieMove extends WolfieState {




    onEnter(options: Record<string, any>): void {
        console.log("Entering the wolfie move state");

        if (this.owner instanceof AnimatedSprite)
            this.owner.animation.play("move");
            // this.owner.disablePhysics();

    }

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.owner.position.dirTo(this.parent.target.position);

        if (!this.parent.moveTimer.isStopped()) {
            this.parent.moveAction.performAction(deltaT, {
                "target": this.owner,
                "position": this.parent.target.position
            }, ()=>{});
        } else{
        // } else {
        //     this.parent.chaseTimer.start();
        //     this.finished(WolfieAIStates.ATTACK);
        // }
        this.parent.chaseTimer.start();
        this.finished(WolfieAIStates.ATTACK);
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}