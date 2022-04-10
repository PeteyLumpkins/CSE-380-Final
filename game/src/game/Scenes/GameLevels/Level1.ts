import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import GameLevel from "../GameLevel";

import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../../AI/Player/PlayerController";
import StoreController from "../../AI/Store/StoreController";
import Attack from "../../Ai/Enemy/EnemyActions/Attack";
// import Move from "../../AI/Enemy/EnemyActions/Move";

import {GameSprites, GameData, GameLayers } from "../../GameEnums";


export default class Level1 extends GameLevel {

    private PLAYER_SPAWN: Vec2 = new Vec2(240, 256);

    loadScene(){
        this.load.tilemap("level", "assets/tilemaps/prototypeMap.json");
        this.load.spritesheet(GameSprites.PLAYER, "assets/spritesheets/player.json");
        this.load.spritesheet(GameSprites.STORE, "assets/spritesheets/store_terminal.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");
        this.load.object(GameData.NAVMESH, "assets/data/navmesh.json");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        //Uncomment this code and comment the above code when you're using your tilemap
        let tilemapLayers = this.add.tilemap("level");

        // FIXME: the player should be able to move under the pipes but for some reason it doesn't work,
        // I'm not sure what's up with the layering.
        this.getTilemap("Floor").getLayer().setDepth(4);
        this.getTilemap("Wall").getLayer().setDepth(6);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        /* Set player spawn and scale for the level */
        this.playerScale = new Vec2(.75, .75);
        this.playerSpawn = new Vec2(240, 256);

        super.startScene();

        this.store = this.add.animatedSprite(GameSprites.STORE, GameLayers.PRIMARY);

        this.store.position.set(this.viewport.getCenter().clone().x , this.viewport.getCenter().clone().y - 32*8);
        this.store.scale.set(0.4, 0.4);
        this.store.addAI(StoreController, {radius: 100, player: this.player});

    }

    // initializeEnemies(){
    //     // Get the enemy data
    //     const enemyData = this.load.getObject("enemyData");

    //     // Create an enemies array
    //     this.enemies = new Array<AnimatedSprite>(enemyData.numEnemies);

        



    //     // Initialize the enemies
    //     for(let i = 0; i < enemyData.numEnemies; i++){
    //         let data = enemyData.enemies[i];

    //         // Create an enemy
    //         this.enemies[i] = this.add.animatedSprite(data.type, "primary");
    //         this.enemies[i].position.set(data.position[0], data.position[1]);
    //         this.enemies[i].animation.play("IDLE");

    //         // Activate physics
    //         this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

    //         if(data.route){
    //             data.route = data.route.map((index: number) => this.graph.getNodePosition(index));                
    //         }

    //         if(data.guardPosition){
    //             data.guardPosition = new Vec2(data.guardPosition[0], data.guardPosition[1]);
    //         }

    //         /*initalize status and actions for each enemy. This can be edited if you want your custom enemies to start out with
    //         different statuses, but dont remove these statuses for the original two enemies*/
    //         let statusArray: Array<string> = [hw4_Statuses.CAN_RETREAT, hw4_Statuses.CAN_BERSERK];

    //         //Vary weapon type and choose actions
    //         let weapon;
    //         let actions;
    //         let range;
    //         // HOMEWORK 4 - TODO
    //         /**
    //          * Once you've set up the actions for your custom enemy types, assign them here so they'll be spawned in your game.
    //          * They can have any weapons you want.
    //          * 
    //          * Your game in the end should have an equal amount of each enemy type (Around 25% of each type of enemy), and at least 20 enemies in
    //          * total. Also, half the enemies should patrol while the other half guard.
    //          */
    //         if (data.type === "gun_enemy"){
    //             weapon = this.createWeapon("weak_pistol")
    //             actions = actionsGun;
    //             range = 100;
    //         }
    //         else if (data.type === "knife_enemy") {
    //             weapon = this.createWeapon("knife")
    //             actions = actionKnife;
    //             range = 20;
    //         }
    //         // This is the laser guy
    //         else if (data.type === "custom_enemy1") {
    //             weapon = this.createWeapon("laserGun");
    //             actions = actionCustom1;
    //             range = 50;
    //         }
    //         // Sniper variant
    //         else if (data.type === "custom_enemy2") {
    //             weapon = this.createWeapon("pistol");
    //             actions = actionCustom2;
    //             range = 200;
    //         }

    //         let enemyOptions = {
    //             defaultMode: data.mode,
    //             patrolRoute: data.route,            // This only matters if they're a patroller
    //             guardPosition: data.guardPosition,  // This only matters if the're a guard
    //             health: data.health,
    //             player1: this.playerCharacters[0],
    //             player2: this.playerCharacters[1],
    //             weapon: weapon,
    //             goal: hw4_Statuses.REACHED_GOAL,
    //             status: statusArray,
    //             actions: actions,
    //             inRange: range
    //         }

    //         this.enemies[i].addAI(EnemyAI, enemyOptions);
    //     }
    // }
}