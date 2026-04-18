import RewardItemType from "../../../core/model/reward/RewardItemType";
import LocalizationService from "../../../core/localization/LocalizationService";
import Settings from "../../../core/service/Settings";
import RewardUtils from "../../../core/utils/RewardUtils";
import SoundUtils from "../../../core/utils/SoundUtils";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import BasePanel from "./BasePanel";
import Label from "./Label";

type RewardFlightResolver = (reward: RewardItemType, index: number) => Phaser.Point;
export type RewardItemsShowOptions = {
    firstRewardOrigin?: Phaser.Point;
};

export default class RewardItemsPanel extends BasePanel {
    private static readonly MAX_ITEMS = 3;
    private static readonly BACKDROP_ALPHA = 0.78;
    private static readonly SHOW_DURATION_MS = 360;
    private static readonly COLLECT_STAGGER_MS = 150;
    private static readonly FLIGHT_DURATION_MS = 700;
    private static readonly CONTENT_TARGET_SCALE = 1.08;
    private static readonly CONTENT_START_SCALE = 0.76;
    private static readonly CTA_SCALE = 1 / 1.5;
    private static readonly MAIN_SHINE_ALPHA = 0.52;
    private static readonly MAIN_SHINE_PULSE_ALPHA = 0.6;
    private static readonly SECONDARY_SHINE_ALPHA = 0.32;
    private static readonly SECONDARY_SHINE_PULSE_ALPHA = 0.4;

    private rewards: RewardItemType[];
    private targetResolver: RewardFlightResolver;
    private onCompleteCallback: () => void;
    private showOptions: RewardItemsShowOptions;

    private backdrop: Phaser.Graphics;
    private tapOverlay: Phaser.Sprite;
    private content: Phaser.Group;
    private shineGroup: Phaser.Group;
    private mainShine: Phaser.Sprite;
    private secondaryShine: Phaser.Sprite;
    private itemGroups: Phaser.Group[] = [];
    private ctaButton: Phaser.Button;
    private loopTweens: Phaser.Tween[] = [];
    private collectStarted = false;

    constructor(game: Phaser.Game, rewards: RewardItemType[], targetResolver: RewardFlightResolver, onComplete?: () => void, showOptions?: RewardItemsShowOptions) {
        super(game, 0, 0, "rewardItemsPanel");

        this.rewards = (rewards || []).filter(reward => !!reward).slice(0, RewardItemsPanel.MAX_ITEMS);
        this.targetResolver = targetResolver;
        this.onCompleteCallback = onComplete;
        this.showOptions = showOptions || {};

        this.backdrop = this.createBackdrop();
        this.tapOverlay = this.createTapOverlay();
        this.content = new Phaser.Group(this.game, this);
        this.content.x = this.game.width / 2;
        this.content.y = this.game.height / 2 - 70;
        this.content.alpha = 0;
        this.content.scale.set(RewardItemsPanel.CONTENT_START_SCALE);

        this.createShine();
        this.createItems();
        this.createCollectButton();
    }

    public show(): void {
        this.collectStarted = false;
        this.stopLoopTweens();
        SoundUtils.rewardReceived();

        this.backdrop.alpha = 0;
        this.content.alpha = 0;
        this.content.scale.set(RewardItemsPanel.CONTENT_START_SCALE);
        this.shineGroup.alpha = 0;
        this.mainShine.angle = 0;
        this.mainShine.alpha = RewardItemsPanel.MAIN_SHINE_ALPHA;
        this.secondaryShine.angle = 0;
        this.secondaryShine.alpha = RewardItemsPanel.SECONDARY_SHINE_ALPHA;
        this.tapOverlay.inputEnabled = true;
        if (this.ctaButton) {
            this.ctaButton.inputEnabled = true;
            this.ctaButton.alpha = 0;
            this.ctaButton.scale.set(RewardItemsPanel.CTA_SCALE * 0.92);
        }

        this.itemGroups.forEach(itemGroup => {
            itemGroup.alpha = 0;
            itemGroup.scale.set(0.68);
            itemGroup.angle = 0;
        });

        this.game.add.tween(this.backdrop).to(
            { alpha: RewardItemsPanel.BACKDROP_ALPHA },
            RewardItemsPanel.SHOW_DURATION_MS,
            this.getShowEasing(),
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.content).to(
            { alpha: 1 },
            RewardItemsPanel.SHOW_DURATION_MS,
            this.getShowEasing(),
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.content.scale).to(
            { x: RewardItemsPanel.CONTENT_TARGET_SCALE, y: RewardItemsPanel.CONTENT_TARGET_SCALE },
            RewardItemsPanel.SHOW_DURATION_MS,
            this.getShowEasing(),
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.shineGroup).to(
            { alpha: 1 },
            RewardItemsPanel.SHOW_DURATION_MS + 80,
            this.getShowEasing(),
            true,
            20,
            0,
            false
        );

        this.itemGroups.forEach((itemGroup, index) => {
            this.showItemGroup(itemGroup, index);
        });

        if (this.ctaButton) {
            this.game.add.tween(this.ctaButton).to(
                { alpha: 1 },
                RewardItemsPanel.SHOW_DURATION_MS,
                this.getShowEasing(),
                true,
                170,
                0,
                false
            );
            this.game.add.tween(this.ctaButton.scale).to(
                { x: RewardItemsPanel.CTA_SCALE, y: RewardItemsPanel.CTA_SCALE },
                RewardItemsPanel.SHOW_DURATION_MS,
                this.getShowEasing(),
                true,
                170,
                0,
                false
            );
        }

        this.game.time.events.add(RewardItemsPanel.SHOW_DURATION_MS + 180, () => {
            if (!this.parent || this.collectStarted) {
                return;
            }

            this.startLoopTweens();
        });
    }

    private collect(): void {
        if (this.collectStarted) {
            return;
        }

        this.collectStarted = true;
        this.tapOverlay.inputEnabled = false;
        if (this.ctaButton) {
            this.ctaButton.inputEnabled = false;
        }
        this.stopLoopTweens();

        const totalFlightTime = RewardItemsPanel.FLIGHT_DURATION_MS
            + Math.max(0, this.itemGroups.length - 1) * RewardItemsPanel.COLLECT_STAGGER_MS;

        this.game.add.tween(this.backdrop).to(
            { alpha: 0 },
            RewardItemsPanel.FLIGHT_DURATION_MS,
            this.getHideEasing(),
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.shineGroup).to(
            { alpha: 0 },
            totalFlightTime,
            this.getHideEasing(),
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.shineGroup.scale).to(
            { x: 0.72, y: 0.72 },
            totalFlightTime,
            this.getHideEasing(),
            true,
            0,
            0,
            false
        );

        this.itemGroups.forEach((itemGroup, index) => {
            const reward = this.rewards[index];
            const target = this.targetResolver
                ? this.targetResolver(reward, index)
                : new Phaser.Point(this.game.width - 110, 90);
            const contentScaleX = this.content.scale.x || RewardItemsPanel.CONTENT_TARGET_SCALE;
            const contentScaleY = this.content.scale.y || RewardItemsPanel.CONTENT_TARGET_SCALE;
            const localTargetX = (target.x - this.content.x) / contentScaleX;
            const localTargetY = (target.y - this.content.y) / contentScaleY;
            const startX = itemGroup.x;
            const startY = itemGroup.y;
            const delay = index * RewardItemsPanel.COLLECT_STAGGER_MS;
            const arcX = startX + (startX <= 0 ? 95 : -95);
            const arcY = startY - 150 - index * 18;

            const moveTween = this.game.add.tween(itemGroup).to(
                {
                    x: [startX, arcX, localTargetX],
                    y: [startY, arcY, localTargetY]
                },
                RewardItemsPanel.FLIGHT_DURATION_MS,
                this.getHideEasing(),
                true,
                delay,
                0,
                false
            );
            moveTween.interpolation(Phaser.Math.bezierInterpolation);

            this.game.add.tween(itemGroup).to(
                { alpha: 0 },
                RewardItemsPanel.FLIGHT_DURATION_MS,
                this.getHideEasing(),
                true,
                delay + 90,
                0,
                false
            );
            this.game.add.tween(itemGroup.scale).to(
                { x: 0.18, y: 0.18 },
                RewardItemsPanel.FLIGHT_DURATION_MS,
                this.getHideEasing(),
                true,
                delay,
                0,
                false
            );
        });

        this.game.time.events.add(totalFlightTime + 40, () => {
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
        });
    }

    private createBackdrop(): Phaser.Graphics {
        let backdrop = new Phaser.Graphics(this.game, 0, 0);
        backdrop.beginFill(0x000000, 1);
        backdrop.drawRect(0, 0, this.game.width, this.game.height);
        backdrop.endFill();
        backdrop.alpha = 0;
        this.addChild(backdrop);
        return backdrop;
    }

    private createTapOverlay(): Phaser.Sprite {
        let tapOverlay = SpriteUtils.createSprite(this.game, 0, 0, "blank");
        tapOverlay.anchor.set(0);
        tapOverlay.width = this.game.width;
        tapOverlay.height = this.game.height;
        tapOverlay.alpha = 0.001;
        tapOverlay.inputEnabled = true;
        tapOverlay.events.onInputDown.add(this.collect, this);
        this.addSprite(tapOverlay);
        return tapOverlay;
    }

    private createShine(): void {
        this.shineGroup = new Phaser.Group(this.game, this.content);

        this.mainShine = SpriteUtils.createSprite(this.game, 0, 0, "flash");
        this.mainShine.anchor.set(0.5);
        this.mainShine.alpha = RewardItemsPanel.MAIN_SHINE_ALPHA;
        this.mainShine.tint = 0xf4f8ff;
        this.shineGroup.add(this.mainShine);

        this.secondaryShine = SpriteUtils.createSprite(this.game, 0, 0, "flash");
        this.secondaryShine.anchor.set(0.5);
        this.secondaryShine.alpha = RewardItemsPanel.SECONDARY_SHINE_ALPHA;
        this.secondaryShine.tint = 0xeaf3ff;
        this.shineGroup.add(this.secondaryShine);

        let shineScale = this.getShineScale(this.rewards.length);
        this.mainShine.scale.set(shineScale);
        this.secondaryShine.scale.set(shineScale * 0.74);
    }

    private createItems(): void {
        const positions = this.getItemPositions(this.rewards.length);

        this.rewards.forEach((reward, index) => {
            let itemGroup = new Phaser.Group(this.game, this.content);
            itemGroup.x = positions[index].x;
            itemGroup.y = positions[index].y;

            let icon = SpriteUtils.createSprite(this.game, 0, 0, RewardUtils.getIconKey(reward));
            icon.anchor.set(0.5);
            icon.scale.set(this.getIconScale(icon, reward));
            itemGroup.add(icon);

            if (reward.count > 1) {
                this.createCountLabel(itemGroup, reward.count, icon);
            }

            if (index === 0 && this.showOptions && this.showOptions.firstRewardOrigin) {
                const localOrigin = this.toContentLocal(this.showOptions.firstRewardOrigin, RewardItemsPanel.CONTENT_START_SCALE);
                itemGroup.x = localOrigin.x;
                itemGroup.y = localOrigin.y;
            }

            this.itemGroups.push(itemGroup);
        });
    }

    private createCountLabel(parent: Phaser.Group, count: number, icon: Phaser.Sprite): void {
        let label = new Label(this.game, 0, 0, "" + count, {
            font: "bold 44px Arial",
            fill: "#f3fbff"
        });
        label.anchor.set(0.5);
        label.y = Math.round(icon.height / 2) - 20;
        label.alpha = 0.96;
        parent.add(label);
    }

    private createCollectButton(): void {
        this.ctaButton = SpriteUtils.createButton(this.game, 0, this.getCollectButtonY(), "pnlButton", () => {
            this.collect();
        });
        this.ctaButton.anchor.set(0.5);
        this.ctaButton.alpha = 0;
        this.ctaButton.scale.set(RewardItemsPanel.CTA_SCALE * 0.92);
        this.content.add(this.ctaButton);

        let label = new Label(this.game, -8, -2, LocalizationService.get("ui.collectRewardCta", "ПОЛУЧИТЬ"), {
            font: "bold 42px Arial",
            fill: "#ffffff"
        });
        label.anchor.set(0.5);
        this.ctaButton.addChild(label);
    }

    private startLoopTweens(): void {
        this.stopLoopTweens();

        this.loopTweens.push(this.game.add.tween(this.mainShine).to(
            { angle: 360 },
            15000,
            Phaser.Easing.Linear.None,
            true,
            0,
            -1,
            false
        ));
        this.loopTweens.push(this.game.add.tween(this.secondaryShine).to(
            { angle: -360 },
            10800,
            Phaser.Easing.Linear.None,
            true,
            0,
            -1,
            false
        ));
        this.loopTweens.push(this.game.add.tween(this.mainShine).to(
            { alpha: RewardItemsPanel.MAIN_SHINE_PULSE_ALPHA },
            3200,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut,
            true,
            0,
            -1,
            true
        ));
        this.loopTweens.push(this.game.add.tween(this.secondaryShine).to(
            { alpha: RewardItemsPanel.SECONDARY_SHINE_PULSE_ALPHA },
            2600,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut,
            true,
            0,
            -1,
            true
        ));

        this.itemGroups.forEach((itemGroup, index) => {
            const floatDistance = 10 + index * 2;
            const angle = index % 2 == 0 ? 3 : -3;

            this.loopTweens.push(this.game.add.tween(itemGroup).to(
                { y: itemGroup.y - floatDistance, angle: angle },
                1800 + index * 170,
                Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut,
                true,
                index * 60,
                -1,
                true
            ));
            this.loopTweens.push(this.game.add.tween(itemGroup.scale).to(
                { x: 1.035, y: 1.035 },
                1650 + index * 140,
                Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut,
                true,
                index * 60,
                -1,
                true
            ));
        });

        if (this.ctaButton) {
            this.loopTweens.push(this.game.add.tween(this.ctaButton.scale).to(
                {
                    x: RewardItemsPanel.CTA_SCALE + (1.03 - RewardItemsPanel.CTA_SCALE) / 2,
                    y: RewardItemsPanel.CTA_SCALE + (1.03 - RewardItemsPanel.CTA_SCALE) / 2
                },
                1800,
                Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut,
                true,
                0,
                -1,
                true
            ));
        }
    }

    private stopLoopTweens(): void {
        this.loopTweens.forEach(tween => {
            if (tween) {
                tween.stop(false);
            }
        });
        this.loopTweens = [];
    }

    private getItemPositions(itemsCount: number): Phaser.Point[] {
        switch (itemsCount) {
            case 3:
                return [
                    new Phaser.Point(0, -136),
                    new Phaser.Point(-176, 92),
                    new Phaser.Point(176, 92)
                ];
            case 2:
                return [
                    new Phaser.Point(-148, 38),
                    new Phaser.Point(148, 38)
                ];
            case 1:
            default:
                return [new Phaser.Point(0, 20)];
        }
    }

    private getShineScale(itemsCount: number): number {
        switch (itemsCount) {
            case 3:
                return 6.4;
            case 2:
                return 5.9;
            case 1:
            default:
                return 5.3;
        }
    }

    private getIconScale(icon: Phaser.Sprite, reward: RewardItemType): number {
        const maxSide = reward && reward.kind == "gems" ? 206 : 194;
        const maxScale = reward && reward.kind == "gems" ? 1.28 : 1.08;
        const currentMaxSide = Math.max(icon.width || 1, icon.height || 1);
        return Math.min(maxScale, maxSide / currentMaxSide) * 1.5;
    }

    private getCollectButtonY(): number {
        switch (this.rewards.length) {
            case 3:
                return 355;
            case 2:
                return 301;
            case 1:
            default:
                return 265;
        }
    }

    private showItemGroup(itemGroup: Phaser.Group, index: number): void {
        const delay = 80 + index * 70;
        const finalPosition = this.getItemPositions(this.rewards.length)[index];
        const hasOriginEntry = index === 0 && !!(this.showOptions && this.showOptions.firstRewardOrigin);

        if (hasOriginEntry) {
            itemGroup.alpha = 0;
            itemGroup.scale.set(0);
            this.game.add.tween(itemGroup).to(
                { x: finalPosition.x, y: finalPosition.y, alpha: 1 },
                RewardItemsPanel.SHOW_DURATION_MS,
                this.getShowEasing(),
                true,
                delay,
                0,
                false
            );
            this.game.add.tween(itemGroup.scale).to(
                { x: 1, y: 1 },
                RewardItemsPanel.SHOW_DURATION_MS,
                this.getShowEasing(),
                true,
                delay,
                0,
                false
            );
            return;
        }

        this.game.add.tween(itemGroup).to(
            { alpha: 1 },
            RewardItemsPanel.SHOW_DURATION_MS,
            this.getShowEasing(),
            true,
            delay,
            0,
            false
        );
        this.game.add.tween(itemGroup.scale).to(
            { x: 1, y: 1 },
            RewardItemsPanel.SHOW_DURATION_MS,
            this.getShowEasing(),
            true,
            delay,
            0,
            false
        );
    }

    private toContentLocal(globalPoint: Phaser.Point, scale: number): Phaser.Point {
        const safeScale = scale || 1;
        return new Phaser.Point(
            (globalPoint.x - this.content.x) / safeScale,
            (globalPoint.y - this.content.y) / safeScale
        );
    }

    private getShowEasing(): Function {
        return Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out;
    }

    private getHideEasing(): Function {
        return Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In;
    }
}
