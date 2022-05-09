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


        // if (!this.inAttackRange(this.parent.target.position)) {
        //     console.log("Not in range and timer is not stopped");
        //     this.finished(WolfieAIStates.MOVE);
        // } 
        if(this.parent.chaseTimer.isStopped()){
            console.log("Done chasing");
            this.parent.vulnerableTimer.start();
            this.finished(WolfieAIStates.VULNERABLE);
        }

        else if ( this.attackTimer.isStopped()) {
            console.log("Attacking!!!");
            this.attackTimer.start();
            if (this.owner instanceof AnimatedSprite) {
                this.owner.animation.play("charging");
            }

            this.onExit();
        } 
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { 
        console.log("exiting");
        if(this.parent.target.position.distanceTo(this.owner.position) <= 160){
                        this.parent.attackAction.performAction(0, {}, ()=>{});

        }    
        this.parent.moveTimer.start();
        return;
    }

}