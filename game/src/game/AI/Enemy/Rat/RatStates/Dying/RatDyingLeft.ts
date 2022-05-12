import RatDying from "./RatDying";

export default class RatDyingLeft extends RatDying {

    public static readonly ANIMATION = "DieLeft";

    onEnter(options: Record<string, any>): void {
        this.animation = RatDyingLeft.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {}
}