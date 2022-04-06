import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";
import EnemyAI from "../EnemyAI";
import EnemyState from "./EnemyState";

import { EnemyStates, EnemyStatuses } from "../../../GameEnums";

export default class Guard extends EnemyState {
    private guardPosition: Vec2;

    private route: NavigationPath;

    private retObj: Record<string, any>;
    
    constructor(parent: EnemyAI, owner: GameNode, guardPosition: Vec2){
        super(parent, owner);

        this.guardPosition = guardPosition;
    }

    onEnter(options: Record<string, any>): void {
        
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {
        
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}