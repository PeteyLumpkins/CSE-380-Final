import State from "../../../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import { PlayerEvents } from "../../../Player/PlayerController";
import WolfieAI, { WolfieAIStates } from "../WolfieAI";

export default abstract class WolfieState extends State {
    protected parent: WolfieAI;
    protected owner: GameNode;

    constructor(parent: WolfieAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    update(deltaT: number): void {
        console.log(this.parent.health);
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACKED: {
                if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
                    this.parent.health -= event.data.get("damage");
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
                    if (this.isDead()) {
                        this.finished(WolfieAIStates.DEAD);
                    }
                }
                break;
            }
            default: {
                console.warn("Unhandled event caught in wolfiestate: " + event.type);
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
