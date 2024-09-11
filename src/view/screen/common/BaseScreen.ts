import ForestDao from '../../../core/dao/ForestDao';
import ReplicaDao from '../../../core/dao/ReplicaDao';
import AdminService from '../../../core/service/AdminService';
import Settings from '../../../core/service/Settings';
import UserService from '../../../core/service/UserService';
import EventUtils from '../../../core/utils/EventUtils';
import ForestUtils from '../../../core/utils/ForestUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Label from '../../component/panel/Label';
import Game from '../../game/Game';
import Preset from '../../game/Preset';
import Utils from './../../../core/utils/Utils';
import DebugScreen from './DebugScreen';
import EventType from './../../../core/model/event/EventType';
export default abstract class BaseScreen extends DebugScreen {
    private lockedMarker: Label;
    private transitionBlocker: Phaser.Graphics;

    private lastLockedAt: number;
    private lastLockedFor: number;
    private lastLockTimer: Phaser.TimerEvent;

    public loadImage(key: string, path: string): void {
        if (!Settings.isGraphicsFromAtlases()) {
            this.load.image(key, path);
        }
        SpriteUtils.images.push({ key: key, path: path });
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

    protected loadScreenSprite(name: string): void {
        if (Settings.isGraphicsFromAtlases()) {
            console.log("loadScreenSprite: " + name + "; " + (this.cache.getFrameData(name) ? true : false))
        }
        if (Settings.isGraphicsFromAtlases() && !this.cache.getFrameData(name)) {
            this.loadImage(name, 'assets/_atlases/screens/' + name + this.getExtension());
            this.load.image(name, 'assets/_atlases/screens/' + name + this.getExtension() + "?" + Settings.ATLASES_VERSION);
        } else {
            this.loadImage(name, 'assets/screens/' + name + this.getExtension());
        }
    }

    protected getExtension(): string {
        return (Game.CAN_USE_WEBP && Settings.USE_WEBP_ATLASES && Settings.isGraphicsFromAtlases() ? ".webp" : ".png");
    }

    protected loadBaseAtlases(): void {
        this.loadAtlas("base-0", "assets/_atlases/base-0");
        this.loadAtlas("base-1", "assets/_atlases/base-1");
        this.loadAtlas("base-2", "assets/_atlases/base-2");
        this.loadAtlas("base-3", "assets/_atlases/base-3");

        this.loadAtlas("basehq", "assets/_atlases/basehq");
    }

    protected loadOptionalAtlases(): void {

        let user = UserService.getUser()

        if (!AdminService.isEditMode() &&  user.getCurrentForest() >= ReplicaDao.getEntity().getById("r41").context.level || AdminService.isEditMode()) {
            this.loadAtlas("chapter1_0", "assets/_atlases/chapter1_0");
            this.loadAtlas("additional0", "assets/_atlases/additional0");
        }

        if(!AdminService.isEditMode() && EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).length > 0 || AdminService.isEditMode()){
            this.loadAtlas("event1", "assets/_atlases/event1");
        }
        
        let forest = ForestDao.getForestType(user.getCurrentForest());

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
                this.loadAtlas(s, "assets/_atlases/" + s)
            } else if (s) {
                this.cache.removeImage(s)
                Utils.delete(SpriteUtils.atlases, s)
            }
        });
    }

    public init() {
        super.init();
        this.transitionBlocker = new Phaser.Graphics(this.game, 0, 0);
        this.transitionBlocker.beginFill(0xb7a8a8, 0);
        this.transitionBlocker.drawRect(0, 0, this.game.width, this.game.height);
        this.transitionBlocker.endFill();
        this.transitionBlocker.inputEnabled = false;
        this.add.existing(this.transitionBlocker);

        if (AdminService.isEditMode()) {
            // this.lockedMarker = new Label(this.game, 0, this.game.height/2, "•" )
            // this.lockedMarker.fixedToCamera  = true;
            // this.lockedMarker.scale.set(20);
            this.lockedMarker = new Label(this.game, 0, this.game.height - 120, "•")
            this.lockedMarker.fixedToCamera = true;
            this.lockedMarker.scale.set(5);
            this.addSprite(this.lockedMarker);

            this.time.events.loop(50, () => {
                this.lockedMarker.bringToTop();
                this.lockedMarker.tint = this.isLocked() ? 0xFF0000 : 0x00FF00;
            })
        }

        if (/*AdminService.cacheComplexImages()&&*/  AdminService.isEditMode()) {
            let fps = new Label(this.game, 100, this.game.height - 200, "FPS: " + this.game.time.fps)
            fps.anchor.set(0, 0.5);
            this.game.add.existing(fps);
            this.game.time.events.loop(500, () => {
                fps.bringToTop();
                fps.text = "FPS: " + this.game.time.fps + " DFPS: " + this.game.time.desiredFps;
            })
        }
    }

    public startScreen(scene: any, clearWorld?: boolean, clearCache?: boolean) {
        (<Game>(this.game)).startScene(scene, clearWorld, clearCache);
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

    protected applyPreset(presets: Preset[]) {
        presets.forEach(preset => {
            if (preset.spriteId != "") {
                let children = this.world.getByName(preset.spriteId)
                if (children && (children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button)) {
                    Utils.applyPreset(children, preset);
                }
            }
        });
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



