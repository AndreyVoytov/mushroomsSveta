import ForestDao from '../../../core/dao/ForestDao';
import ReplicaDao from '../../../core/dao/ReplicaDao';
import EventsConfiguration, { EventAssetConfiguration } from '../../../core/configuration/EventsConfiguration';
import AdminService from '../../../core/service/AdminService';
import Settings from '../../../core/service/Settings';
import UserService from '../../../core/service/UserService';
import EventUtils from '../../../core/utils/EventUtils';
import ForestUtils from '../../../core/utils/ForestUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from '../../component/panel/BasePanel';
import Label from '../../component/panel/Label';
import { getAtlasGroupNames } from '../../../generated/atlasManifest';
import Game from '../../game/Game';
import Preset from '../../game/Preset';
import Utils from './../../../core/utils/Utils';
import DebugScreen from './DebugScreen';
import EventType from './../../../core/model/event/EventType';
export default abstract class BaseScreen extends DebugScreen {
    private lockedMarker: Label | Phaser.Text;
    private transitionBlocker: Phaser.Sprite;
    private dialogOverlayGroup: Phaser.Group;
    private topOverlayGroup: Phaser.Group;

    private lastLockedAt: number;
    private lastLockedFor: number;
    private lastLockTimer: Phaser.TimerEvent;

    public loadImage(key: string, path: string): void {
        if (!Settings.isGraphicsFromAtlases()) {
            this.load.image(key, path);
        }
        if (!SpriteUtils.images.some(image => image.key == key && image.path == path)) {
            SpriteUtils.images.push({ key: key, path: path });
        }
    }

    public loadAtlas(key: string, path: string): void {
        if (Settings.isGraphicsFromAtlases()) {
            console.log("loadAtlas: " + key + "; " + (this.cache.getFrameData(key) ? true : false))
        }
        if (Settings.isGraphicsFromAtlases() && !this.cache.getFrameData(key)) {
            this.load.atlasJSONHash(key, path + this.getExtension() + "?" + Settings.ATLASES_VERSION, path + ".json" + "?" + Settings.ATLASES_VERSION);
        }
        if (SpriteUtils.atlases.indexOf(key) == -1) {
            SpriteUtils.atlases.push(key);
        }
    }

    protected loadAtlasGroup(groupId: string): void {
        getAtlasGroupNames(groupId).forEach(name => {
            this.loadAtlas(name, 'assets/atlases/' + name);
        });
    }

    protected unloadAtlasGroup(groupId: string): void {
        getAtlasGroupNames(groupId).forEach(name => {
            this.cache.removeImage(name)
            Utils.delete(SpriteUtils.atlases, name)
        });
    }

    protected loadScreenSprite(name: string): void {
        if (Settings.isGraphicsFromAtlases()) {
            console.log("loadScreenSprite: " + name + "; " + (this.cache.getFrameData(name) ? true : false))
        }
        if (Settings.isGraphicsFromAtlases() && !this.cache.getFrameData(name)) {
            this.loadImage(name, 'assets/atlases/screens/' + name + this.getExtension());
            this.load.image(name, 'assets/atlases/screens/' + name + this.getExtension() + "?" + Settings.ATLASES_VERSION);
        } else {
            this.loadImage(name, 'assets/screens/' + name + this.getExtension());
        }
    }

    protected getExtension(): string {
        return (Game.CAN_USE_WEBP && Settings.USE_WEBP_ATLASES && Settings.isGraphicsFromAtlases() ? ".webp" : ".png");
    }

    protected loadBaseAtlases(): void {
        this.loadAtlasGroup("base");
        this.loadAtlasGroup("basehq");
    }

    protected loadOptionalAtlases(): void {

        let user = UserService.getUser()

        if (!AdminService.isEditMode() &&  user.getCurrentForest() >= ReplicaDao.getEntity().getById("r41").context.level || AdminService.isEditMode()) {
            this.loadAtlasGroup("chapter1");
            this.loadAtlasGroup("additional");
        }

        if(!AdminService.isEditMode() && EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).length > 0 || AdminService.isEditMode()){
            this.loadAtlasGroup("event1");
        }
        
        let forest = EventUtils.getActiveEventForestType() || ForestDao.getForestType(user.getCurrentForest());

        //load only one screen, remove others
        let allScreens = ForestUtils.getAllScreenImages();
        let screensToLoad = [ForestUtils.getScreenImage(user.getLocation())];
        screensToLoad = screensToLoad.concat(ReplicaDao.getEntity().getAll().filter(r => r.context.level == user.getCurrentForest() && r.location).map(r => ForestUtils.getScreenImage(r.location)));

        // console.log(ReplicaDao.getEntity().getAll().filter(r => r.context.level == user.getCurrentForest()))
        // console.log(ReplicaDao.getEntity().getAll().filter(r => r.context.level == user.getCurrentForest() && r.location))
        // console.log(screensToLoad)

        allScreens.forEach(s => {
            if (screensToLoad.indexOf(s) != -1 || AdminService.isEditMode()) {
                this.loadScreenSprite(s);
            } else if (s) {
                this.cache.removeImage(s)
            }
        });

        //load only one minigame screen, remove others
        let allMinigameScreens = ForestUtils.getAllMinigameScreenImages();
        let minigameScreensToLoad = [ForestUtils.getMinigameScreenImage(forest.environment)];

        //Final panel (AllLevelsCompletedPanel) needs flowersFieldHeader
        if (UserService.getUser().getCurrentForest() >= ForestDao.getAllForests().length) {
            minigameScreensToLoad.push("minigame5");
        }

        allMinigameScreens.forEach(s => {
            if (minigameScreensToLoad.indexOf(s) != -1 || AdminService.isEditMode()) {
                this.loadAtlasGroup(s)
            } else if (s) {
                this.unloadAtlasGroup(s)
            }
        });

        if (ForestUtils.isCloverReskin(forest) || AdminService.isEditMode()) {
            this.loadAtlasGroup("minigame9");
        } else {
            this.unloadAtlasGroup("minigame9");
        }

        if ((forest && forest.header == "hiveHeader") || AdminService.isEditMode()) {
            this.loadAtlasGroup("minigame10");
        } else {
            this.unloadAtlasGroup("minigame10");
        }
    }

    protected loadOptionalConfiguredEventResources(includeAwaitingActivation?: boolean): void {
        const requiredAssetKeys: string[] = [];
        const requiredAtlasGroups: string[] = [];

        EventUtils.getConfiguredEventIdsWithOptionalAssets(includeAwaitingActivation).forEach(eventId => {
            EventUtils.getConfiguredEventAssets(eventId).forEach(asset => {
                if (!asset || !asset.key || !asset.path) {
                    return;
                }

                if (requiredAssetKeys.indexOf(asset.key) == -1) {
                    requiredAssetKeys.push(asset.key);
                }

                this.loadImage(asset.key, asset.path);

                if (Settings.isGraphicsFromAtlases() && asset.atlasGroup) {
                    if (requiredAtlasGroups.indexOf(asset.atlasGroup) == -1) {
                        requiredAtlasGroups.push(asset.atlasGroup);
                    }

                    if (!this.isOptionalEventAssetCached(asset)) {
                        this.loadAtlasGroup(asset.atlasGroup);
                    }
                } else if (!this.isOptionalEventAssetCached(asset) && Settings.isGraphicsFromAtlases()) {
                    this.load.image(asset.key, asset.path + "?" + Settings.ATLASES_VERSION);
                }
            });
        });

        if (Settings.isGraphicsFromAtlases()) {
            EventsConfiguration.getOptionalAtlasGroups().forEach(groupId => {
                if (requiredAtlasGroups.indexOf(groupId) == -1 && !AdminService.isEditMode()) {
                    this.unloadAtlasGroup(groupId);
                }
            });
        }

        EventsConfiguration.allEvents.forEach(eventConfig => {
            EventUtils.getConfiguredEventDynamicAssets(eventConfig.eventId).forEach(asset => {
                if (!asset || !asset.key || requiredAssetKeys.indexOf(asset.key) != -1 || !this.isImageCached(asset.key)) {
                    return;
                }

                this.cache.removeImage(asset.key);
            });
        });
    }

    public init() {
        super.init();
        this.ensureDialogOverlayGroup();
        this.ensureTopOverlayGroup();
        let blockerTexture = this.game.make.bitmapData(1, 1);
        blockerTexture.ctx.fillStyle = '#ffffff';
        blockerTexture.ctx.fillRect(0, 0, 1, 1);
        blockerTexture.dirty = true;

        this.transitionBlocker = new Phaser.Sprite(this.game, 0, 0, blockerTexture);
        this.transitionBlocker.name = '__transitionBlocker';
        this.transitionBlocker.width = this.game.width;
        this.transitionBlocker.height = this.game.height;
        this.transitionBlocker.alpha = 0.001;
        this.transitionBlocker.inputEnabled = false;
        this.add.existing(this.transitionBlocker);

        if (AdminService.isEditMode()) {
            // this.lockedMarker = new Label(this.game, 0, this.game.height/2, "\u2022" )
            // this.lockedMarker.fixedToCamera  = true;
            // this.lockedMarker.scale.set(20);
            this.lockedMarker = this.game.add.text(0, this.game.height - 120, "\u2022", { font: "40px Arial", fill: "#ffffff" })
            this.lockedMarker.fixedToCamera = true;
            this.lockedMarker.scale.set(5);
            this.addSprite(this.lockedMarker);

            this.time.events.loop(50, () => {
                this.lockedMarker.bringToTop();
                this.lockedMarker.tint = this.isLocked() ? 0xFF0000 : 0x00FF00;
            })
        }

        if (/*AdminService.cacheComplexImages()&&*/  AdminService.isEditMode()) {
            let fps = this.game.add.text(100, this.game.height - 30, "FPS: " + this.game.time.fps, { font: "24px Arial", fill: "#ffffff" })
            fps.anchor.set(0, 0.5);
            this.game.time.events.loop(500, () => {
                fps.bringToTop();
                fps.text = "FPS: " + this.game.time.fps + " DFPS: " + this.game.time.desiredFps;
            })
        }
    }

    public startScreen(scene: any, clearWorld?: boolean, clearCache?: boolean) {
        (<Game>(this.game)).startScene(scene, clearWorld, clearCache);
    }

    public shutdown(): void {
        if (this.dialogOverlayGroup) {
            this.dialogOverlayGroup.destroy(true);
            this.dialogOverlayGroup = null;
        }
        if (this.topOverlayGroup) {
            this.topOverlayGroup.destroy(true);
            this.topOverlayGroup = null;
        }
    }

    public lockScreenFor(millis: number) {
        let now = new Date().getTime();
        console.log("try lock: " + this.lastLockedAt + " " + this.lastLockedFor)
        if (!this.lastLockedAt || (this.lastLockedAt && (this.lastLockedAt + this.lastLockedFor) < now + millis)) {
            this.game.time.events.remove(this.lastLockTimer);

            this.lastLockedAt = now;
            this.lastLockedFor = millis;

            console.log("LOCK SCREEN FOR " + millis)
            this.lockScreen();
            this.lastLockTimer = this.game.time.events.add(millis, () => {
                this.unlockScreen();
            }, this);
        }
    }

    public lockScreen() {
        this.game.world.bringToTop(this.transitionBlocker);
        this.transitionBlocker.inputEnabled = true;
    }

    public unlockScreen() {
        this.transitionBlocker.inputEnabled = false;
    }

    public isLocked(): boolean {
        return this.transitionBlocker.inputEnabled;
    }

    public addDialogOverlayPanel<T extends BasePanel>(panel: T): T {
        this.attachForDebug(panel);
        this.ensureDialogOverlayGroup().add(panel);
        this.refreshOverlayOrder();
        return panel;
    }

    public addTopOverlay<T extends PIXI.DisplayObject>(displayObject: T): T {
        let topOverlayGroup = this.ensureTopOverlayGroup();
        topOverlayGroup.add(<any>displayObject);
        this.refreshOverlayOrder();
        return displayObject;
    }

    public bringDialogOverlayToFront(): void {
        this.refreshOverlayOrder();
    }

    public bringTopOverlayToFront(): void {
        this.refreshOverlayOrder();
    }

    protected applyPreset(presets: Preset[]) {
        presets.forEach(preset => {
            if (preset.spriteId != "") {
                let children = this.world.getByName(preset.spriteId)
                if (children && (children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button || children instanceof Phaser.BitmapText || children instanceof Phaser.Text)) {
                    Utils.applyPreset(<any>children, preset);
                }
            }
        });
    }

    private ensureDialogOverlayGroup(): Phaser.Group {
        if (!this.dialogOverlayGroup || !this.dialogOverlayGroup.parent) {
            this.dialogOverlayGroup = new Phaser.Group(this.game, this.game.stage, '__dialogOverlayGroup');
            this.refreshOverlayOrder();
        }

        return this.dialogOverlayGroup;
    }

    private ensureTopOverlayGroup(): Phaser.Group {
        if (!this.topOverlayGroup || !this.topOverlayGroup.parent) {
            this.topOverlayGroup = new Phaser.Group(this.game, this.game.stage, '__topOverlayGroup');
            this.refreshOverlayOrder();
        }

        return this.topOverlayGroup;
    }

    private refreshOverlayOrder(): void {
        let stage = this.game && this.game.stage;
        if (!stage) {
            return;
        }

        if (this.dialogOverlayGroup && this.dialogOverlayGroup.parent) {
            let dialogIndex = stage.children.length - (this.topOverlayGroup && this.topOverlayGroup.parent ? 2 : 1);
            stage.setChildIndex(this.dialogOverlayGroup, Math.max(0, dialogIndex));
        }

        if (this.topOverlayGroup && this.topOverlayGroup.parent) {
            stage.setChildIndex(this.topOverlayGroup, stage.children.length - 1);
        }
    }

    private isImageCached(key: string): boolean {
        const cache: any = this.game && this.game.cache;
        if (!cache || !key) {
            return false;
        }

        if (cache.checkImageKey) {
            return cache.checkImageKey(key);
        }

        try {
            return !!cache.getImage(key, true);
        } catch (e) {
            return false;
        }
    }

    private isOptionalEventAssetCached(asset: EventAssetConfiguration): boolean {
        if (!asset) {
            return false;
        }

        if (Settings.isGraphicsFromAtlases() && asset.atlasGroup && asset.path) {
            const frameName = asset.path.indexOf("assets/") == 0 ? asset.path.substring(7) : asset.path;
            return getAtlasGroupNames(asset.atlasGroup).some(groupName => {
                const frameData = this.cache.getFrameData(groupName);
                return !!frameData && frameData.checkFrameName(frameName);
            });
        }

        return this.isImageCached(asset.key);
    }

    protected attachText(name: string, text: string, style?: Phaser.PhaserTextStyle): Label {
        let label
        if (style) {
            label = new Label(this.game, 0, 0, text, style);
        } else {
            label = new Label(this.game, 0, 0, text);
        }
        label.anchor.set(0.5)
        label.name = name;
        this.addSprite(label);
        if (DebugScreen.DEBUG_MODE) {
            label.inputEnabled = true;
        }
        return label;
    }
    protected attachButton(spriteId: string, callback, name?: string): Phaser.Button {
        let sprite = SpriteUtils.createButton(this.game, 0, 0, spriteId, callback);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addButton(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }
    protected attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 0, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }


}






