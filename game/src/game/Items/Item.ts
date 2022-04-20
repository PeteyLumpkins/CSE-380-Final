import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Item {
    //data to be obtained from json file:
    path: string;
    attack: number;
    speed: number;
    health: number;
    cost:number;
    name: string;

    //im thinking that this is enough since our items are just sprites with numbers attached right? lol
    initialize(options: Record<string, any>) : void{
        this.attack=options.buffsattack;
        this.health=options.buffs.health;
        this.speed=options.buffs.speed;
        this.name=options.name;
        this.path=options.path;
        this.cost=options.number;
    }

    clone() : Item {
        let newItem=new Item();
        newItem.initialize({path:this.path, attack:this.attack, speed:this.speed, health:this.health, cost:this.cost, name:this.name});
        return newItem
    }
}