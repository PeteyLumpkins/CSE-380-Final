import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";


import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";
import GameOver from "../GameOver";
import GameLevel from "./GameLevel";

export default class Level5 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(0, 0);
    public static readonly STORE_LEVEL_POS = new Vec2(0, 0);
    public static readonly NEXT_LEVEL_POS = new Vec2(0, 0);

    /** SCENE METHODS */

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level5.PLAYER_SPAWN_POS;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
    }

    loadScene(): void {
        super.loadScene();

        /** TODO: Load level stuff here */
    }

    unloadScene(): void {
        super.unloadScene();
    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);
        super.startScene();
    }

    /** GAMELEVEL METHODS */

    initViewport(): void {
        this.viewport.setZoomLevel(3);
    }

    initPlayer(): void {
        throw new Error("Method not implemented.");
    }

    initStore(): void {}

    initMap(): void {
        throw new Error("Method not implemented.");
    }

    initLevelLinks(): void {
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.copy(Level5.NEXT_LEVEL_POS);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: GameOver, nextLevelData: {
            spawn: Vec2.ZERO, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initEnemies(): void {
        throw new Error("Method not implemented.");
    }
    
}