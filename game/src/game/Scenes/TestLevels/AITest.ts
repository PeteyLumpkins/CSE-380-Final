// import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
// import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
// import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

// import GameLevel from "../GameLevel";

// import PlayerController from "../../AI/Player/PlayerController";
// import StoreController from "../../AI/Store/StoreController";

// import {GameSprites, GameData, GameLayers } from "../../GameEnums";
// import Input from "../../../Wolfie2D/Input/Input";
// import GameNode from "../../../Wolfie2D/Nodes/GameNode";
// import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

// import EnemyAI from "../../AI/Enemy/EnemyAI";

// import Attack  from "../../AI/Enemy/EnemyActions/Attack";
// import Move from "../../AI/Enemy/EnemyActions/Move";
// import { EnemyStatuses } from "../../GameEnums";

// export default class AITest extends GameLevel {

//     private enemy: AnimatedSprite;


//     loadScene(){
//         this.load.tilemap("level", "assets/tilemaps/MyMap.json");
//         this.load.spritesheet(GameSprites.PLAYER, "assets/spritesheets/player.json");
//         this.load.spritesheet("store_terminal", "assets/spritesheets/store_terminal.json");
//         this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");

//         this.load.object(GameData.NAVMESH, "assets/data/navmesh.json");
//     }

//     /**
//      * The "Scene" class has an options parameter that we'll use to pass the players
//      * health and buffs through the game levels.
//      */
//     startScene(){
//         let tilemapLayers = this.add.tilemap("level");

//         this.getTilemap("Floor").getLayer().setDepth(4);
//         this.getTilemap("Wall").getLayer().setDepth(6);

//          // Get the wall layer
//         this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

//         // Set the viewport bounds to the tilemap
//         let tilemapSize: Vec2 = this.walls.size.scale(.5, .5);

//         this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

//         this.playerScale = new Vec2(.75, .75);
//         this.playerSpawn = new Vec2(256, 240);

//         super.startScene();

//         this.enemy = this.add.animatedSprite(GameSprites.PLAYER, GameLayers.PRIMARY);
//         this.enemy.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);

//         let possibleActions = [
//             new Attack(4, [EnemyStatuses.IN_RANGE], [EnemyStatuses.GOAL_REACHED]),
//             new Move(3, [], [EnemyStatuses.IN_RANGE], {inRange: 100}),
//         ]
//         let enemyOptions = {
//             health: 20,
//             player: this.player,
//             goal: EnemyStatuses.GOAL_REACHED,
//             actions: possibleActions,
//             inRange: 100
//         }
//         this.enemy.addAI(EnemyAI, enemyOptions);
//     }

//     updateScene(deltaT: number): void {
//         super.updateScene(deltaT);
//     }

// }