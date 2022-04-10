import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import EnemyAI from "../EnemyAI";
import EnemyState from "./EnemyState";

import { EnemyStates, EnemyStatuses } from "../../../GameEnums";

export default class Guard extends EnemyState {
    private guardPosition: Vec2;

    private route: NavigationPath;

    private retObj: Record<string, any>;
    
    constructor(parent: EnemyAI, owner: AnimatedSprite, guardPosition: Vec2){
        super(parent, owner);

        this.guardPosition = guardPosition;
    }

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play("IDLE");
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {
        
        if (this.owner.position.distanceTo(this.parent.player.position) < this.parent.inRange) {
            this.finished(EnemyStates.ACTIVE);
        }

    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}