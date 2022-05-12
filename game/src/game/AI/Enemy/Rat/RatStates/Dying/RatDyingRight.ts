import RatDying from "./RatDying";

export default class RatDyingRight extends RatDying {

    public static readonly ANIMATION = "DieRight";

    onEnter(options: Record<string, any>): void {
        this.animation = RatDyingRight.ANIMATION;
        super.onEnter(options);
    }

    takeDamage(): void {}
}