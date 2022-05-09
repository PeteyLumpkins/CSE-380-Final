import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { PlayerEvents } from "../../Player/PlayerController";
import AttackAction, { AttackActionType } from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";
import EnemyAI from "../EnemyAI";
import WolfieCharge from "./WolfieStates/WolfieCharge";
import WolfieIdle from "./WolfieStates/WolfieIdle";
import WolfieKnockback from "./WolfieStates/WolfieKnockback";
import WolfieMove from "./WolfieStates/WolfieMove";
import WolfieTransform from "./WolfieStates/WolfieTransform";
import WolfieKnockback_STAGE_1 from "./WolfieStates/WolfieKnockback_STAGE_1";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import WolfieVulnerable from "./WolfieStates/WolfieVulnerable";
import WolfieDead from "./WolfieStates/WolfieDead";






export enum WolfieAIStates {
    IDLE = "WOLFIE_IDLE_STATE",
    MOVE = "WOLFIE_MOVING_STATE",
    KNOCK_BACK = "WOLFIE_KNOCKED_BACK_STATE",
    DEAD = "WOLFIE_DEAD_STATE",
    PLAYER_SEEN = "PLAYER_SEEN",
    STAGE_1 = "STAGE_1",
    TRANSFORM = "TRANSFORM",
    KNOCK_BACK_STAGE_1 = "WOLFIE_KNOCKED_BACK_STATE_STAGE_1",
    ATTACK = "WOLFIE_CHARGING_STATE",
    VULNERABLE = "VULNERABLE"
}

export default class WolfieAI extends EnemyAI {
    /** Actions that the rat can perform/undergo kinda will go here? */
    attackAction: AttackAction;
    moveAction = new MoveAction("navmesh", 100, true);
    knockbackAction = new MoveAction("navmesh", 200, true);
    angle: Timer;
    angleDeg: number;
    transformed: Boolean;
    lastPlayerPos: Vec2;

    target: GameNode;
    /** Custom attributes specific to the rat ai go here */
    maxHealth: number;
    health: number;

    moveSpeed: number;

    sightRange: number;

    attackRange: number;
    attackDamage: number;

    /** Cooldown timers for the knockback and attack of the rat */
    knockbackCooldownTimer: Timer = new Timer(2000);
    chaseTimer: Timer = new Timer(5000);
    vulnerableTimer: Timer = new Timer(2000);
    // attackTimer: Timer = new Timer(5000);

    update(deltaT: number): void {

        super.update(deltaT);
        // if(this.angle.isStopped()){
        //     this.angle.start();
        //     this.angleDeg >= 360 ? this.angleDeg = 0 : this.angleDeg+=10;

        //     console.log(this.angleDeg);
        // }
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
                    if(!this.transformed){
                        this.changeState(WolfieAIStates.KNOCK_BACK);
                    }
                    else{
                        this.changeState(WolfieAIStates.KNOCK_BACK_STAGE_1);

                    }
                }
            }

    }

    initStates(): void {
        this.addState(WolfieAIStates.IDLE, new WolfieIdle(this, this.owner));
        this.addState(WolfieAIStates.MOVE, new WolfieMove(this, this.owner));
        this.addState(WolfieAIStates.KNOCK_BACK, new WolfieKnockback(this, this.owner));
        this.addState(WolfieAIStates.TRANSFORM, new WolfieTransform(this, this.owner));
        this.addState(WolfieAIStates.KNOCK_BACK_STAGE_1, new WolfieKnockback_STAGE_1(this, this.owner));        
        this.addState(WolfieAIStates.ATTACK, new WolfieCharge(this, this.owner));
        this.addState(WolfieAIStates.VULNERABLE, new WolfieVulnerable(this, this.owner));
        this.addState(WolfieAIStates.DEAD, new WolfieDead(this, this.owner));
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
        this.transformed = false;
        // this.angle = new Timer(360);
        this.angleDeg = 0;
        this.attackAction = new AttackAction({
            type: AttackActionType.WOLFIE,
            damage: 1,
            attacker: this.owner,
            attackRange: 160
        });
        // this.attackAction = AttackAction.attackActionBuilder(AttackActionType.WOLFIE, this.owner);

    }
    subscribeToEvents(): void {
        this.receiver.subscribe(WolfieAIStates.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }

}