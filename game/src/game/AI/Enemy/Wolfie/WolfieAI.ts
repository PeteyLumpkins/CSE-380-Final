import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { PlayerEvents } from "../../Player/PlayerController";
import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";
import EnemyAI from "../EnemyAI";
import WolfieCharge from "./WolfieStates/WolfieCharge";
import WolfieIdle from "./WolfieStates/WolfieIdle";
import WolfieKnockback from "./WolfieStates/WolfieKnockback";
import WolfieMove from "./WolfieStates/WolfieMove";
import WolfieTransform from "./WolfieStates/WolfieTransform";




export enum WolfieAIStates {
    IDLE = "WOLFIE_IDLE_STATE",
    MOVE = "WOLFIE_MOVING_STATE",
    ATTACK = "WOLFIE_ATTACKING_STATE",
    KNOCK_BACK = "WOLFIE_KNOCKED_BACK_STATE",
    DEAD = "WOLFIE_DEAD_STATE",
    PLAYER_SEEN = "PLAYER_SEEN",
    STAGE_1 = "STAGE_1",
    TRANSFORM = "TRANSFORM"
}

export default class WolfieAI extends EnemyAI {
    /** Actions that the rat can perform/undergo kinda will go here? */
    attack = new AttackAction({amount: 2});
    move = new MoveAction("navmesh", 100, true);
    knockback = new MoveAction("navmesh", 200, true);


    target: GameNode;
    /** Custom attributes specific to the rat ai go here */
    maxHealth: number;
    health: number;

    moveSpeed: number;

    sightRange: number;

    attackRange: number;
    attackDamage: number;

    /** Cooldown timers for the knockback and attack of the rat */
    attackCooldownTimer: Timer = new Timer(2000);
    knockbackCooldownTimer: Timer = new Timer(2000);

    update(deltaT: number): void {
        super.update(deltaT);
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    handleEvent(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACKED: {
                console.log("Caught player attacked event in Wolfie");
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event caught in WOLFIE");
                break;
            }
        }
    }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.health -= event.data.get("damage");
            if (this.knockbackCooldownTimer.isStopped()) {
                this.knockbackCooldownTimer.start();
                this.changeState(WolfieAIStates.KNOCK_BACK);
            }
        }
    }

    initStates(): void {
        this.addState(WolfieAIStates.IDLE, new WolfieIdle(this, this.owner));
        this.addState(WolfieAIStates.ATTACK, new WolfieCharge(this, this.owner));
        this.addState(WolfieAIStates.MOVE, new WolfieMove(this, this.owner));
        this.addState(WolfieAIStates.KNOCK_BACK, new WolfieKnockback(this, this.owner));
        this.addState(WolfieAIStates.TRANSFORM, new WolfieTransform(this, this.owner));
        this.initialize(WolfieAIStates.IDLE);
    }
    initOptions(options: Record<string, any>): void {
        this.maxHealth = options.health;
        this.health = options.health;
        this.sightRange = options.sightRange;
        this.moveSpeed = options.moveSpeed;
        this.attackRange = options.attackRange;
        this.attackDamage = options.attackDamage;
        this.target = options.target;
    }
    subscribeToEvents(): void {
        this.receiver.subscribe(WolfieAIStates.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }

}