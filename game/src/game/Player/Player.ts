import GameNode from "../../Wolfie2D/Nodes/GameNode";
import PlayerInventory from "./PlayerInventory";
import PlayerStats from "./PlayerStats";
import Scene from "../../Wolfie2D/Scene/Scene";

export default class Player {

    node: GameNode;
    inventory: PlayerInventory;
    stats: PlayerStats;

    constructor(node: GameNode, inventory: Array<string>, stats: Record<string,any>) {
        this.node = node;
        this.inventory = new PlayerInventory(this, inventory, 9);
        this.stats = new PlayerStats(this, stats);
    }

    /**
     * Adds the buffs associated with the given itemKey to the player's stats
     * 
     * @param itemKey the key of the item
     */
    addBuffs(itemKey: string): void {
        let itemData = this.node.getScene().load.getObject("item-data");
        let buffs = itemData[itemKey].buffs;

        // Should be a stat for each of the stats a player
        for (let buff of buffs) {
            console.log(buff.type + " " + buff.scale);
            this.stats.setStat(buff.type, (this.stats.getStat(buff.type) !== null ? this.stats.getStat(buff.type) : 1)*buff.scale);
        }
    }

    /**
     * Removes the buffs associated with the given key from the player's stats
     * 
     * @param itemKey the key of the item whos buffs are to be removed
     */
    removeBuffs(itemKey: string): void {
        let itemData = this.node.getScene().load.getObject("item-data");
        console.log(itemKey);
        let buffs = itemData[itemKey].buffs;

        // Should be a case for each of the stats a player can have
        for (let buff of buffs) {
            this.stats.setStat(buff.type, (this.stats.getStat(buff.type) !== null ? this.stats.getStat(buff.type) : 1)/buff.scale);
        }
    }

}