import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../Wolfie2D/Events/GameEventType";
import { PlayerEvents } from "../../../Player/PlayerController";
import GooseAI from "../GooseAI";

export default abstract class GooseState extends State {

    parent: GooseAI;
    owner: GameNode;

    animation: string;

    constructor(parent: GooseAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACKED: {
                this.handlePlayerAttackEvent(event);
                break;
            } 
            default: {
                console.warn("Unknown event type seen in goose state: " + event.type);
                break;
            }
        }
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.parent.health -= event.data.get("damage");
            this.takeDamage();
        }
    }

    abstract takeDamage(): void;

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

import { GooseAttackRight, GooseAttackLeft } from "./Attack/GooseAttack";
import { GooseMoveRight, GooseMoveLeft } from "./Move/GooseMove";
import { NormalGooseIdle, DemonGooseIdle } from "./Idle/GooseIdle";
import { GooseHitRight, GooseHitLeft } from "./Hit/GooseHit";
import { GooseDyingRight, GooseDyingLeft } from "./Dying/GooseDying";
import GooseDead from "./GooseDead";

export { 
    GooseAttackRight, GooseAttackLeft, 
    GooseMoveRight, GooseMoveLeft,
    NormalGooseIdle, DemonGooseIdle,
    GooseHitRight, GooseHitLeft,
    GooseDyingRight, GooseDyingLeft,
    GooseDead
} 

