import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { WolfieAIStates } from "../WolfieAI";
import WolfieState from "./WolfieState";


export default class WolfieCharge extends WolfieState {

    onEnter(options: Record<string, any>): void {
        console.log('Entering the WolfieCharge attack state');
        this.owner.enablePhysics();

        console.log(this.parent.chaseTimer.isStopped());
    }

    update(deltaT: number): void {
        super.update(deltaT);
        // !travesty
        // let targetPos = this.parent.target.position.clone();
        // targetPos.x = targetPos.x - (200 * (Math.sin(this.parent.target.position.angleToCCW(this.owner.position) + Math.PI) / (Math.PI + 180)));
        // targetPos.y = targetPos.y - (200 * (Math.cos(this.parent.target.position.angleToCCW(this.owner.position) + Math.PI) / (Math.PI + 180)));


        if (!this.inAttackRange(this.parent.target.position) && !this.attackTimer.isStopped()) {
            console.log("Not in range and timer is not stopped");
            this.finished(WolfieAIStates.MOVE);
        } 
        else if(this.parent.chaseTimer.isStopped()){
            console.log("Done chasing");
            this.parent.vulnerableTimer.start();
            this.finished(WolfieAIStates.VULNERABLE);
        }
        else if (this.attackReady() && this.attackTimer.isStopped()) {
            console.log("Attacking!!!");
            this.attackTimer.start();
            if (this.owner instanceof AnimatedSprite) {
                this.owner.animation.play("charging");
            }
            // this.parent.moveAction.performAction(deltaT, {
            //     "target": this.owner,
            //     "position": targetPos
            // }, ()=>{});
            this.parent.attackAction.performAction(0, {}, ()=>{});
            this.finished(WolfieAIStates.VULNERABLE);
        } 
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}