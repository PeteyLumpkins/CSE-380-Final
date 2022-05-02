import Emitter from "../../../Wolfie2D/Events/Emitter";
import { PlayerEvents } from "./PlayerController";

/**
 * These are the keys that will be used to identify the different player stats.
 */
export enum PlayerStat {
    HEALTH = "HEALTH",
    MONEY = "MONEY",
    MOVE_SPEED = "MOVE_SPEED",
    ATTACK_DMG = "ATTACK_DMG",
    DMG_RESIST = "DMG_RESIST",
}

export default class PlayerStats {

    private stats: Record<string,any>;
    private emitter: Emitter;

    constructor(stats: Record<string,any>) {
        this.stats = stats;
        this.emitter = new Emitter();
    }

    /**
     * Adds the buffs associated with the given itemKey to the player's stats
     * 
     * @param itemKey the key of the item
     */
    addBuffs(buffs: Array<Record<string,any>>): void {
        for (let buff of buffs) {
            console.log(buff.type + " " + buff.scale);
            this.setStat(buff.type, (this.getStat(buff.type) !== null ? this.getStat(buff.type) : 1)*buff.scale);
        }
    }

    /**
     * Removes the buffs associated with the given key from the player's stats
     * 
     * @param itemKey the key of the item whos buffs are to be removed
     */
    removeBuffs(buffs: Array<Record<string,any>>): void {
        // Should be a case for each of the stats a player can have
        for (let buff of buffs) {
            console.log(buff.type + " " + buff.scale);
            this.setStat(buff.type, (this.getStat(buff.type) !== null ? this.getStat(buff.type) : 1)/buff.scale);
        }
    }

    getStat(key: string): any {
        if (key in this.stats) {
            return this.stats[key];
        }
        return null;
    }

    setStat(key: string, value: any): void {
        this.stats[key] = value;
        switch(key) {
            case "MONEY": {
                this.emitter.fireEvent(PlayerEvents.MONEY_CHANGE, {amount: value});
                break;
            }
            case "HEALTH": {
                this.emitter.fireEvent(PlayerEvents.HEALTH_CHANGE, {amount: value});
                break;
            }
            default: {
                break;
            }
        }
    
    }

    getCopy(): Record<string, any> { 
        return JSON.parse(JSON.stringify(this.stats));
    }

}