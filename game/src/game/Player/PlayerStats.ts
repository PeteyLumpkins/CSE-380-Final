import Emitter from "../../Wolfie2D/Events/Emitter";
import Player from "./Player";

import { PlayerEvents } from "../AI/Player/PlayerController";

export default class PlayerStats {

    private player: Player;
    private stats: Record<string,any>;
    private emitter: Emitter;

    constructor(player: Player, stats: Record<string,any>) {
        this.player = player;
        this.stats = stats;
        this.emitter = new Emitter();
    }

    getStat(key: string): any {
        if (key in this.stats) {
            return this.stats[key];
        }
        return null;
    }

    setStat(key: string, value: any): void {
        if (key in this.stats) {
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
    }

}