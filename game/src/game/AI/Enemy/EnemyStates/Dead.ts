import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import EnemyAI from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Dead extends EnemyState {

    constructor(parent: EnemyAI, owner: AnimatedSprite) {
        super(parent, owner);
    }

    onEnter(options: Record<string, any>): void {
        // Player a death animation or something?
        // fire event back to sence to clean up this enemy?
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {

    }

    onExit(): Record<string, any> {
        return;
    }

}