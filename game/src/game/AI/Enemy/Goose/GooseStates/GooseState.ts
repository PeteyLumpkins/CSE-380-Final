import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import GooseAI from "../GooseAI";
import { GooseAIStates } from "../GooseAI"

export default abstract class GooseState extends State {

    parent: GooseAI;

    owner: GameNode;

    constructor(parent: GooseAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    update(deltaT: number): void {}

    protected attackReady(): boolean {
        return this.parent.attackCooldownTimer.isStopped();
    }

    protected isDead(): boolean {
        return this.parent.health <= 0;
    }

    protected hasBeenHit(): boolean {
        return this.parent.health < this.parent.maxHealth;
    }

    protected inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }

    protected inAttackRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.attackRange;
    }

}

import GooseAttack from "./Attack/GooseAttack";
import GooseDead from "./GooseDead";
import GooseIdle from "./Idle/NormalGooseIdle";
import GooseKnockback from "./GooseKnockback";
import GooseMove from "./Move/GooseMove";

export { GooseAttack, GooseDead, GooseIdle, GooseKnockback, GooseMove }

