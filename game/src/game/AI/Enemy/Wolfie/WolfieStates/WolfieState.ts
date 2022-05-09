import State from "../../../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";

export default abstract class WolfieState extends State {
    protected parent: WolfieAI;
    protected owner: GameNode;
    protected attackTimer: Timer;

    constructor(parent: WolfieAI, owner: GameNode){
        super(parent);
        this.owner = owner;
        this.attackTimer = new Timer(5000);
    }

    protected attackReady(): boolean {
        return this.attackTimer.isStopped();
    }
    update(deltaT: number): void {

        // If the wolfie is dead - transition to the dead state
        if (this.isDead()) {
            if(!this.parent.transformed){
                this.finished(WolfieAIStates.TRANSFORM);
            } else{
                this.finished(WolfieAIStates.DEAD);
            }
        }

    }
    protected isDead(): boolean {
        return this.parent.health <= 0;
    }
    protected inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }
    protected inAttackRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.attackRange;
    }
    public getParent() {
        return this.parent;
    }
}
