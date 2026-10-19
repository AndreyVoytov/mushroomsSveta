import UserService from '../../../core/service/UserService';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import Label from './Label';
import HouseScreen from '../../screen/HouseScreen';
import BasePanel from './BasePanel';
import RecipeUtils from '../../../core/utils/RecipeUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import PrizesConfiguration from '../../../core/configuration/PrizesConfiguration';
import ForestDao from '../../../core/dao/ForestDao';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import RewardUtils from '../../../core/utils/RewardUtils';
import LocalizationService from '../../../core/localization/LocalizationService';
import UiLayout from '../../../core/utils/UiLayout';

export default class ProgressBar extends BasePanel {
    private static readonly PROGRESS_VISUALIZE_DELAY = 1000;
    private static readonly PROGRESS_VISUALIZE_DURATION = 500;
    private static readonly TRACK_LEFT = -322;
    private static readonly TRACK_WIDTH = 552;
    private static readonly TRACK_INSET_LEFT = 43;
    private static readonly TRACK_INSET_RIGHT = 43;
    private screen: HouseScreen;
    private currentTask: DiaryContentType;
    private progressFill: Phaser.Graphics;
    private progressValue = { ratio: 0 };
    private characterImage: Phaser.Sprite;
    private taskText: Label;
    private resultImage: Phaser.Sprite;
    private taskCount: Label;
    private totalCount: number;
    private currentCount: number;
    public startY: number;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number, currentTask: DiaryContentType, hidden?: boolean) {
        super(game, x, y, 'blank');
        this.startY = y;this.screen = screen;this.currentTask = currentTask;
        const tweens = game.tweens;
        this.events.onDestroy.addOnce(() => tweens.removeFrom(this.progressValue));
        const user = UserService.getUser(), start = RecipeUtils.getRequiredLevel(currentTask);
        const nextTask = DiaryConfiguration.getNextrecipe(user.getCurrentForest());
        const finish = nextTask ? RecipeUtils.getRequiredLevel(nextTask) : start;
        this.totalCount = Math.max(0, finish - start);
        this.currentCount = Math.min(this.totalCount, Math.max(0, user.getCurrentForest() - start));

        const board = this.attachSprite('statusPanel', 'statusPanel');
        SpriteUtils.fitPanel(board, 720, 170, 26, 24);board.position.set(-15, 0);
        const contact = new Phaser.Graphics(game, -15, -28);
        [0.09, 0.08, 0.06].forEach((alpha, i) => {
            contact.beginFill(0x213b30, alpha);
            contact.drawEllipse(0, 0, 255 - i * 14, 22 - i * 4);contact.endFill();
        });
        this.addChild(contact);
        const header = this.attachSprite(currentTask.mapPreset ? 'forestHeader' : 'potionHeader', 'header');
        SpriteUtils.fitIcon(header, 660, 196);header.position.set(-15, -120);

        const track = this.attachSprite('progressLineBg', 'progressLineBg');
        SpriteUtils.fitPanel(track, ProgressBar.TRACK_WIDTH, 46, 28, 0);
        track.anchor.set(0, 0.5);track.position.set(ProgressBar.TRACK_LEFT, 4);
        this.progressFill = new Phaser.Graphics(game, ProgressBar.TRACK_LEFT + ProgressBar.TRACK_INSET_LEFT, 4);
        this.progressFill.name = 'progressFill';this.addChild(this.progressFill);
        const ticks = new Phaser.Graphics(game, this.progressFill.x, 4);
        ticks.lineStyle(1, 0x9b824e, 0.4);
        if (this.totalCount <= 12) for (let i = 1; i < this.totalCount; i++) {
            const tickX = this.getProgressBodyWidth(i);ticks.moveTo(tickX, -9);ticks.lineTo(tickX, 9);
        }
        this.addChild(ticks);
        this.taskCount = this.attachText('taskCount', '', {font: 'bold 28px Arial', fill: Label.INK});
        this.taskCount.position.set(ProgressBar.TRACK_LEFT + ProgressBar.TRACK_WIDTH / 2, 4);
        const medal = this.attachSprite('dialogMedallion', 'resultMedallion');
        medal.position.set(280, 4);SpriteUtils.fitIcon(medal, 100, 100);
        const resultKey = currentTask.resultImageForProgress || currentTask.resultImage;
        if (resultKey) {
            this.resultImage = this.attachSprite(resultKey, 'resultImage');
            this.resultImage.position.set(280, 4);SpriteUtils.fitIcon(this.resultImage, 76, 76);
        }
        if (currentTask.mapPreset) {
            this.characterImage = this.attachSprite('character', 'character');
            this.characterImage.anchor.set(0.5, 1);SpriteUtils.fitIcon(this.characterImage, 64, 96);this.characterImage.y = -20;
        }
        const ribbon = this.attachSprite('uiSectionRibbon', 'ribbon');
        SpriteUtils.fitPanel(ribbon, 730, 112, 64, 0);ribbon.position.set(-15, 96);
        this.taskText = this.attachText('taskText', LocalizationService.get(currentTask.titleForProgress || currentTask.title), {
            font: '34px Lora', fill: Label.ON_DARK, align: 'center'
        });
        this.taskText.position.set(-15, 96);this.taskText.lineGap = -6;UiLayout.fit(this.taskText, 520, 72, true);
        this.scale.set(0.9);

        const animateProgress = user.isJustCompletedLevel() && this.currentCount > 0, finalCount = this.currentCount;
        if (animateProgress) this.currentCount--;
        this.drawProgress(this.totalCount > 0 ? this.currentCount / this.totalCount : 0);
        if (animateProgress) this.visualizeAndSetProgress(finalCount, ProgressBar.PROGRESS_VISUALIZE_DELAY);
        else if (hidden) {this.y += 300;this.alpha = 0;}

        // Preserve reward eligibility and timing independently of the new visual track.
        PrizesConfiguration.allPrizes.forEach(prize => {
            const level = ForestDao.getAllForests().indexOf(ForestDao.getEntity().getById(prize.level));
            if (level > finish || level < start + this.currentCount || user.getMarkers().indexOf(prize.id) >= 0) return;
            const gift = this.attachSprite('gift', 'progressGift');
            gift.position.set(this.progressFill.x + this.getProgressBodyWidth(level - start), 4);SpriteUtils.fitIcon(gift, 44, 44);
            if (level === start + this.currentCount) {
                const delay = user.isJustCompletedLevel() ? ProgressBar.PROGRESS_VISUALIZE_DELAY + ProgressBar.PROGRESS_VISUALIZE_DURATION : 0;
                const origin = this.getGlobalPointForChild(gift.x, gift.y);
                this.game.time.events.add(delay, () => {
                    this.game.tweens.removeFrom(gift);const rewards = RewardUtils.fromPrize(prize);
                    AnimationUtils.fadeOut(this.game, gift, 0, 220);
                    this.screen.showRewardItems(rewards, () => {RewardUtils.applyRewards(user, rewards);user.addMarker(prize.id);}, {firstRewardOrigin: origin});
                });
            }
        });
    }

    /** Zero draws nothing; full progress reaches the painted track's inner right edge. */
    private drawProgress(ratio: number): void {
        const value = this.totalCount > 0 ? Math.max(0, Math.min(1, isFinite(ratio) ? ratio : 0)) : 0;
        this.progressValue.ratio = value;
        const width = (ProgressBar.TRACK_WIDTH - ProgressBar.TRACK_INSET_LEFT - ProgressBar.TRACK_INSET_RIGHT) * value;
        this.progressFill.clear();this.progressFill.visible = width > 0;
        if (width > 0) {
            this.progressFill.beginFill(0x98b58a, 1);
            this.progressFill.drawRoundedRect(0, -13, width, 26, Math.min(13, width / 2));this.progressFill.endFill();
            if (width > 8) {
                this.progressFill.beginFill(0xe8efca, 0.45);
                this.progressFill.drawRoundedRect(3, -10, width - 6, 7, 3);this.progressFill.endFill();
            }
        }
        this.taskCount.text = Math.round(value * this.totalCount) + ' / ' + this.totalCount;UiLayout.fit(this.taskCount, 160, 34);
        if (this.characterImage) this.characterImage.x = this.progressFill.x + width;
    }

    private visualizeAndSetProgress(currentCount: number, delay: number): void {
        this.currentCount = Math.max(0, Math.min(this.totalCount, currentCount));
        const ratio = this.totalCount > 0 ? this.currentCount / this.totalCount : 0;
        const animationTime = ProgressBar.PROGRESS_VISUALIZE_DURATION;
        this.game.tweens.removeFrom(this.progressValue);
        const tween = this.game.add.tween(this.progressValue).to({ratio}, animationTime, Phaser.Easing.Linear.None, true, delay);
        tween.onUpdateCallback(() => this.drawProgress(this.progressValue.ratio));
        tween.onComplete.addOnce(() => this.drawProgress(ratio));
        if (this.totalCount > 0 && this.currentCount === this.totalCount) {
            const flash = this.attachSprite('flash');flash.position.set(280, 4);flash.scale.set(0);flash.alpha = 0;
            if (this.resultImage) this.bringChildToTop(this.resultImage);
            this.game.add.tween(flash.scale).to({x: 1.5, y: 1.5}, 300, Phaser.Easing.Linear.None, true, delay + animationTime - 100);
            this.game.add.tween(flash).to({alpha: 0.8}, 300, Phaser.Easing.Linear.None, true, delay + animationTime - 100);
            this.game.add.tween(flash).to({angle: 360}, 6000, Phaser.Easing.Linear.None, true, delay, -1, false);
            this.screen.hideUI(delay + animationTime + 1700);
            this.game.add.tween(this).to({y: this.game.height + 400}, 700, Phaser.Easing.Linear.None, true, delay + animationTime + 1000);
            this.screen.lockScreenFor(delay + animationTime + 3500);
            this.game.time.events.add(delay + animationTime + 2000, () => {
                UserService.getUser().addCompletedTask(this.currentTask.id);this.screen.progressAnimation = false;this.screen.dialogPanel.updateReplica(true);
            });
        }
    }

    private getProgressBodyWidth(currentCount: number): number {
        return this.totalCount > 0 ? Math.max(0, Math.min(1, currentCount / this.totalCount)) *
            (ProgressBar.TRACK_WIDTH - ProgressBar.TRACK_INSET_LEFT - ProgressBar.TRACK_INSET_RIGHT) : 0;
    }
    public getCurrent(): number {return this.currentCount;}
    public getTotal(): number {return this.totalCount;}
    private getGlobalPointForChild(x: number, y: number): Phaser.Point {
        return (<any>this).toGlobal ? (<any>this).toGlobal(new Phaser.Point(x, y)) : new Phaser.Point(this.x + x, this.y + y);
    }
}
