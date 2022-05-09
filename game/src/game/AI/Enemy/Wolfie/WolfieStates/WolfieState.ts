import State from "../../../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";

export default abstract class WolfieState extends State {
    protected parent: WolfieAI;
    protected owner: GameNode;

    constructor(parent: WolfieAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    protected attackReady(): boolean {
        return this.parent.attackCooldownTimer.isStopped();
    }
    update(deltaT: number): void {

        // If the wolfie is dead - transition to the dead state
        if (this.isDead()) {
            this.finished(WolfieAIStates.TRANSFORM);
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
