
import CustomizationType from '../../core/model/enum/CustomizationType';
import AdminService from '../../core/service/AdminService';
import YandexGamesHelper from '../../core/service/integration/YandexGamesHelper';
import OkHelper from '../../core/service/integration/OkHelper';
import Settings from '../../core/service/Settings';
import ShopService from '../../core/service/ShopService';
import ServerStoreComponent from '../../core/service/store/ServerStoreComponent';
import UserService from '../../core/service/UserService';
import AnalyticUtils from '../../core/utils/AnalyticUtils';
import NeverError from '../../core/utils/NeverError';
import SoundUtils from '../../core/utils/SoundUtils';
import SpriteUtils from '../../core/utils/SpriteUtils';
import Game from './../../view/game/Game';
import ColorTransitionPanel from './../component/panel/ColorTransitionPanel';
import BaseScreen from "./common/BaseScreen";
import ForestScreen from './ForestScreen';
import HouseScreen from './HouseScreen';
import Utils from '../../core/utils/Utils';
import EventUtils from '../../core/utils/EventUtils';
import LocationUtils from '../../core/utils/LocationUtils';
import { Easing } from 'phaser-ce';

export default class LoadingScreen extends BaseScreen {

    private preloadBar: Phaser.Sprite;
    private preloadBarBg: Phaser.Sprite;
    private preloadBarFooter: Phaser.Sprite;

    preload() {

        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        //preload progress
        let bg = SpriteUtils.createSprite(this.game, this.world.centerX, this.world.centerY, 'forestHouseBg');
        this.game.add.existing(bg);
        bg.anchor.set(0.5);
        if (this.game.height > Game.MAX_HEIGHT) {
            bg.scale.set(this.game.height / Game.MAX_HEIGHT);
        }

        let preloadBarBg = SpriteUtils.createSprite(this.game, this.world.centerX, this.world.centerY, 'preloadBarBg');
        this.game.add.existing(preloadBarBg);
        preloadBarBg.anchor.set(0.5);
        this.preloadBarBg = preloadBarBg;

        let preloadBarWidth = 655;
        let preloadBarHeight = 143;

        this.preloadBar = SpriteUtils.createSprite(this.game, this.world.centerX - preloadBarWidth / 2, this.world.centerY - preloadBarHeight / 2, 'preloadBar');
        this.game.add.existing(this.preloadBar);
        this.load.setPreloadSprite(this.preloadBar);


        let preloadBarFooter = SpriteUtils.createSprite(this.game, 0, this.world.height, 'preloadBarFooter');
        this.game.add.existing(preloadBarFooter);
        preloadBarFooter.anchor.set(0, 1);
        this.preloadBarFooter = preloadBarFooter;

        bg.alpha = 0;
        preloadBarBg.alpha = 0;
        this.preloadBar.alpha = 0;
        preloadBarFooter.alpha = 0;

        let time = 200;
        this.game.add.tween(bg).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true);
        this.game.add.tween(preloadBarBg).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true);
        this.game.add.tween(this.preloadBar).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true);
        this.game.add.tween(preloadBarFooter).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true);

        //plugins
        // this.game.plugins.add(Fabrique.Plugins.NineSlice);

        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        this.game.kineticScrolling.configure({
            kineticMovement: true,
            timeConstantScroll: 650, //really mimic iOS
            horizontalScroll: false,
            verticalScroll: true,
            horizontalWheel: false,
            verticalWheel: true,
            deltaWheel: 10,
            onUpdate: null //A function to get the delta values if it's required (deltaX, deltaY)
        });

        //РёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїР»Р°С‚РµР¶РЅРѕРіРѕ js API 
        this.game.time.events.add(500, () => {
            let cust = AnalyticUtils.getCustomization();
            switch (cust) {
                case CustomizationType.android:
                case CustomizationType.webDev:
                    //do nothing
                    break;
                case CustomizationType.yandexGames:
                    YandexGamesHelper.init();
                    break;
                case CustomizationType.odkl:
                    OkHelper.init();
                    break;
                default:
                    console.log("test " + cust);
                    throw new NeverError(cust);
            }
        })

        ServerStoreComponent.syncronizeUserWithServer();
        ServerStoreComponent.updateFriendsFromServer()

        let user = UserService.getUser();
        if(user.isInterruptWinRows()){
            user.setWinsInRow(0);
            user.setInterruptWinsRow(false);
        }
        user.setLastLoginAt(new Date());
        EventUtils.updateEvents();

        AdminService.setLifes();
        AdminService.setEverydayGems();
        AdminService.setDebugMode();
        AdminService.applyEventCommands();
        AdminService.addExtraGemsToTester();

        this.loadAssets();

        this.updatePlatformAndSource();
    }

    private updatePlatformAndSource():void{
        let user = UserService.getUser();
        
        let platform = Utils.getUrlParameter("mob_platform");
        if(platform && AnalyticUtils.getCustomization() == CustomizationType.odkl){
            user.setPlatform("ok_"+platform);
        }

        let platformSource = Utils.getUrlParameter("refplace");
        if(platformSource && AnalyticUtils.getCustomization() == CustomizationType.odkl){
            user.setPlatformSource("ok_"+platformSource);
        }
    }

    create() {
        let loop = this.game.time.events.loop(300, () => {
            if (UserService.userLoaded) {
                let timePortion = 500;

                if(!LocationUtils.isHouseStoryLocation(UserService.getUser())){
                    this.add.existing(new ColorTransitionPanel(this.game, 0x000000, 200, timePortion, true));
                    Game.WHITE_TRANSITION = true;
                } else {
                    this.game.add.tween(this.preloadBar).to({alpha:0}, timePortion, Easing.Linear.None, true, 0);
                    this.game.add.tween(this.preloadBarBg).to({alpha:0}, timePortion, Easing.Linear.None, true, 0);
                    this.game.add.tween(this.preloadBarFooter).to({alpha:0}, timePortion, Easing.Linear.None, true, 0);
                }

                this.game.time.events.add(200 + timePortion, () => {
                    let user = UserService.getUser();
                    if (user.getCurrentForest() == 0) {
                        AnalyticUtils.logLevelStart()
                        SoundUtils.birds1()
                        this.startScreen(ForestScreen, true, false);
                    } else {
                        this.startScreen(HouseScreen, true, false);
                    }

                    YandexGamesHelper.markReady();
                    ShopService.checkAndApplyLastBuys(true);

                    loop.timer.remove(loop)
                })
            }
        })
    }

    private loadAssets(): void {
        //    //nine-slice example
        //    (<IGame> this.game).load.nineSlice('panel2', 'assets/base/ui/buttons/frame11.png', 160, 160, 80, 80);
        //    (<IGame> this.game).load.nineSlice('panel1', 'assets/base/ui/buttons/frame92.png', 160, 160, 80, 80);

        if (Settings.isGraphicsFromAtlases()) {
            this.loadBaseAtlases();
            this.loadOptionalAtlases();
        }
        this.loadOptionalConfiguredEventResources();

        //TODO СЂР°СЃРїСЂРµРґРµР»РёС‚СЊ РєР°СЂС‚РёРЅРєРё РІ СЃРѕРѕС‚РІРµС‚СЃС‚РІРёРё СЃ Р°С‚Р»Р°СЃР°РјРё

        //UI
        this.load.bitmapFont('bm_arial', 'assets/base/fonts/bitmap/bm_arial.png', 'assets/base/fonts/bitmap/bm_arial.fnt');
        this.load.bitmapFont('bm_panel_digits_brown', 'assets/base/fonts/bitmap/bm_panel_digits_brown.png', 'assets/base/fonts/bitmap/bm_panel_digits_brown.fnt');
        this.load.bitmapFont('bm_hive_digits_legacy', 'assets/base/fonts/bitmap/bm_hive_digits_legacy.png', 'assets/base/fonts/bitmap/bm_hive_digits_legacy.fnt');
        this.load.bitmapFont('bm_bookman', 'assets/base/fonts/bitmap/bm_bookman.png', 'assets/base/fonts/bitmap/bm_bookman.fnt');
        this.load.bitmapFont('bm_gilroy', 'assets/base/fonts/bitmap/bm_gilroy.png', 'assets/base/fonts/bitmap/bm_gilroy.fnt');
        this.load.bitmapFont('bm_balsamiq', 'assets/base/fonts/bitmap/bm_balsamiq.png', 'assets/base/fonts/bitmap/bm_balsamiq.fnt');
        this.load.bitmapFont('bm_times', 'assets/base/fonts/bitmap/bm_times.png', 'assets/base/fonts/bitmap/bm_times.fnt');
        this.load.bitmapFont('bm_times_italic', 'assets/base/fonts/bitmap/bm_times_italic.png', 'assets/base/fonts/bitmap/bm_times_italic.fnt');
        this.load.bitmapFont('bm_diary_digits', 'assets/base/fonts/bitmap/bm_diary_digits.png', 'assets/base/fonts/bitmap/bm_diary_digits.fnt');
        this.loadImage('blank', 'assets/base/ui/blank.png');

        // this.loadImage('houseFrame', 'assets/screens/houseFrame.png');

        this.loadImage('skipButton', 'assets/base/ui/skipButton.png');
        // this.loadImage('progress', 'assets/base/ui/progressbar/progress.png');
        this.loadImage('progressBody', 'assets/base/ui/progressbar/body.jpg');
        // this.loadImage('progressBg', 'assets/base/ui/progressbar/progressBg.png');
        this.loadImage('progressLineBg', 'assets/base/ui/progressbar/progressLineBg.png');
        this.loadImage('progressTail', 'assets/base/ui/progressbar/tail.png');
        this.loadImage('flash', 'assets/base/ui/progressbar/flash.png');
        // this.loadImage('taskImg', 'assets/base/ui/progressbar/taskImg.png');
        this.loadImage('scale', 'assets/base/ui/progressbar/scale.png');
        // this.loadImage('wood', 'assets/base/ui/progressbar/wood.png');
        this.loadImage('shadow', 'assets/base/ui/progressbar/shadow.png');
        this.loadImage('ribbon', 'assets/base/ui/progressbar/ribbon.png');
        this.loadImage('ribbon2', 'assets/base/ui/progressbar/ribbon2.png');
        this.loadImage('circle', 'assets/base/ui/progressbar/circle.png');
        this.loadImage('circleSmall', 'assets/base/ui/progressbar/circleSmall.png');
        this.loadImage('forestHeader', 'assets/base/ui/progressbar/forestHeader.png');
        // this.loadImage('darkForestHeader', 'assets/base/ui/progressbar/darkForestHeader.png');
        this.loadImage('potionHeader', 'assets/base/ui/progressbar/potionsHeader.png');
        this.loadImage('progressCheck', 'assets/base/ui/progressbar/progressCheck.png');


        this.loadImage('progressCircle', 'assets/base/ui/progressCircle.png');

        this.loadImage('boots', 'assets/chapter1/attic/boots.png');
        this.loadImage('bootsBroken', 'assets/chapter1/attic/bootsBroken.png');
        this.loadImage('batteryLow', 'assets/chapter1/attic/batteryLow.png');
        this.loadImage('batteryFull', 'assets/chapter1/attic/batteryFull.png');
        this.loadImage('battery1', 'assets/chapter1/attic/battery1.png');
        this.loadImage('battery2', 'assets/chapter1/attic/battery2.png');
        this.loadImage('battery3', 'assets/chapter1/attic/battery3.png');


        this.loadImage('actionBoots', 'assets/base/action/actionBoots.png');
        this.loadImage('actionSphere', 'assets/base/action/actionSphere.png');
        this.loadImage('pot1', 'assets/base/action/pot1.png');
        this.loadImage('pot2', 'assets/base/action/pot2.png');
        this.loadImage('pot3', 'assets/base/action/pot3.png');
        this.loadImage('pot4', 'assets/base/action/pot4.png');
        this.loadImage('dish1', 'assets/base/action/dish1.png');
        this.loadImage('dish2', 'assets/base/action/dish2.png');
        this.loadImage('catAim', 'assets/base/action/cat.png');

        this.loadImage('joystick', 'assets/other/editor/joystick.png');


        // this.loadImage('boilerProgress', 'assets/base/ui/progressbar/boilerProgress.png');
        // this.loadImage('forestProgress', 'assets/base/ui/progressbar/forestProgress.png');
        this.loadImage('character', 'assets/base/ui/progressbar/character.png');
        this.loadImage('gift', 'assets/base/ui/progressbar/gift.png');

        this.loadImage('bushes', 'assets/base/ui/bushes.png');
        this.loadImage('bushes2', 'assets/base/ui/bushes2.png');
        this.loadImage('bushDark', 'assets/base/ui/bushDark.png');
        this.loadImage('bushDark2', 'assets/base/ui/bushDark2.png');
        this.loadImage('darkStump', 'assets/minigame3/darkStump.png');

        this.loadImage('flowersBg', 'assets/base/ui/flowersBg.png');


        this.loadImage('flowersBg', 'assets/base/ui/flowersBg.png');
        this.loadImage('stoneBig', 'assets/base/ui/stoneBig.png');

        this.loadImage('dwarfs', 'assets/chapter1/fields/dwarfs.png');
        this.loadImage('cage', 'assets/chapter1/fields/cage.png');
        this.loadImage('boombox', 'assets/chapter1/fields/boombox.png');
        this.loadImage('boombox2', 'assets/chapter1/fields/boombox2.png');
        this.loadImage('solovei', 'assets/chapter1/fields/solovei.png');

        this.loadImage('owlVision', 'assets/chapter1/attic/owlVision.png');
        this.loadImage('sphere1', 'assets/chapter1/attic/sphere1.png');
        this.loadImage('sphere2', 'assets/chapter1/attic/sphere2.png');

        this.loadImage('cloudBig', 'assets/chapter1/attic/vision/cloudBig.png');
        this.loadImage('everest', 'assets/chapter1/attic/vision/everest.png');
        this.loadImage('everestSky', 'assets/chapter1/attic/vision/sky.png');
        this.loadImage('vedmaEverest', 'assets/chapter1/attic/vision/vedmaEverest.png');

        this.loadImage('voltorna', 'assets/chapter1/darkForest/voltorna.png');
        this.loadImage('strawberryBucket', 'assets/chapter1/darkForest/strawberryBucket.png');
        this.loadImage('monocle', 'assets/chapter1/darkForest/monocle.png');
        this.loadImage('cyclop', 'assets/chapter1/darkForest/cyclop.png');
        this.loadImage('unicorn1', 'assets/chapter1/darkForest/unicorn1.png');
        this.loadImage('unicorn2', 'assets/chapter1/darkForest/unicorn2.png');
        this.loadImage('unicorn3', 'assets/chapter1/darkForest/unicorn3.png');
        this.loadImage('flour', 'assets/chapter1/forest/flour.png');

        this.loadImage('topPanelFrame', 'assets/base/ui/topPanelFrame.png');
        this.loadImage('topPanel', 'assets/base/ui/topPanel.png');
        this.loadImage('decor', 'assets/base/ui/decor.png');
        this.loadImage('panel', 'assets/base/ui/panel.png');
        this.loadImage('panel2', 'assets/base/ui/panel2.png');
        this.loadImage('statusPanel', 'assets/base/ui/statusPanel.png');
        this.loadImage('slotOpened', 'assets/base/ui/slotOpened.png');
        this.loadImage('helperPanel', 'assets/base/ui/helperPanel.png');
        // this.loadImage('helperPanel2', 'assets/base/ui/helperPanel.png');
        this.loadImage('helperPanel2', 'assets/base/ui/helperPanel2.png');
        this.loadImage('steps', 'assets/base/ui/steps.png');
        this.loadImage('heart', 'assets/base/ui/heart.png');
        this.loadImage('lightning', 'assets/base/ui/lightnin_draft.png');
        this.loadImage('gems', 'assets/base/ui/gems.png');
        this.loadImage('gemsCloud', 'assets/base/ui/gemsCloud.png');
        this.loadImage('tasks', 'assets/base/ui/tasks.png');
        this.loadImage('tasksPanelBgTop', 'assets/base/task/bg_top.png');
        this.loadImage('tasksPanelBgCenter', 'assets/base/task/bg_center.png');
        this.loadImage('tasksPanelBgBottom', 'assets/base/task/bg_bottom.png');
        this.loadImage('tasksPanelHeaderRibbon', 'assets/base/task/header_ribbon.png');
        this.loadImage('tasksPanelTabActive', 'assets/base/task/tab_active.png');
        this.loadImage('tasksPanelTabInactive', 'assets/base/task/tab_inactive.png');
        this.loadImage('tasksPanelListTop', 'assets/base/task/taks_list_bg_top.png');
        this.loadImage('tasksPanelListCenter', 'assets/base/task/taks_list_bg_center.png');
        this.loadImage('tasksPanelListBottom', 'assets/base/task/taks_list_bg_bottom.png');
        this.loadImage('tasksPanelProgressEmpty', 'assets/base/task/progress_empty.png');
        this.loadImage('tasksPanelProgressFull', 'assets/base/task/progress_full.png');
        this.loadImage('energy_chest', 'assets/base/task/energy_chest.png');
        this.load.image('energy_chest', 'assets/base/task/energy_chest.png');
        this.loadImage('tasksPanelChest', 'assets/base/task/chest.png');
        this.loadImage('tasksPanelChest2', 'assets/base/task/chest2.png');
        this.loadImage('tasksPanelChest3', 'assets/base/task/chest3.png');
        this.loadImage('tasksPanelChest4', 'assets/base/task/chest4.png');
        this.loadImage('tasksPanelChest5', 'assets/base/task/chest5.png');
        this.loadImage('tasksPanelChest6', 'assets/base/task/chest6.png');
        this.loadImage('tasksPanelChest7', 'assets/base/task/chest7.png');
        this.loadImage('tasksPanelOrnament', 'assets/base/task/ornament.png');
        this.loadImage('tasksPanelTaskBg', 'assets/base/task/task_bg.png');
        this.loadImage('tasksPanelTaskItemBg', 'assets/base/task/task_item_bg.png');
        this.loadImage('tasksPanelTaskRewardBg', 'assets/base/task/task_reward_bg.png');
        this.loadImage('tasksPanelClose', 'assets/base/task/task_panel_close.png');
        this.loadImage('tasksPanelTaskProgressEmpty', 'assets/base/task/task_progress_empty.png');
        this.loadImage('tasksPanelTaskProgressFull', 'assets/base/task/task_progress_full.png');
        this.loadImage('keyUI', 'assets/base/ui/key.png');

        this.loadImage('point', 'assets/base/ui/point.png');
        this.loadImage('cloud', 'assets/base/ui/cloud.png');



        this.loadImage('check', 'assets/base/ui/check.png');
        this.loadImage('cross', 'assets/base/ui/cross.png');
        this.loadImage('circleGray', 'assets/base/ui/circleGray.png');
        this.loadImage('circleOrange', 'assets/base/ui/circleOrange.png');
        this.loadImage('circleBooster', 'assets/base/ui/circle.png');
        this.loadImage('circleBoosterBlue', 'assets/base/ui/circleB.png');
        this.loadImage('arrow', 'assets/base/ui/arrow.png');
        this.loadImage('diary', 'assets/base/ui/diary.png');
        this.loadImage('newMark', 'assets/base/ui/newMark.png');
        this.loadImage('plusSteps', 'assets/base/ui/plusSteps.png');
        this.loadImage('frameLight', 'assets/base/ui/frameLight.png');
        // this.loadImage('plusSteps3', 'assets/base/ui/plusSteps3.png'); //TODO remove

        this.loadImage('settingsButton', 'assets/base/ui/settingsButton.png');
        this.loadImage('playButton', 'assets/base/ui/playButton.png');
        this.loadImage('closeButton', 'assets/base/ui/closeButton.png');
        this.loadImage('closeButtonViolet', 'assets/base/ui/closeButtonViolet.png');
        this.loadImage('pnlButton', 'assets/base/ui/pnlButton.png');
        this.loadImage('wooden_tab', 'assets/base/ui/wooden_tab.png');
        this.loadImage('banner1', 'assets/base/ui/banner1.png');
        this.loadImage('banner2', 'assets/minigame2/banner2.png');
        // this.loadImage('banner3', 'assets/minigame3/banner3.png');
        // this.loadImage('banner4', 'assets/base/ui/banner4.png');
        // this.loadImage('banner5', 'assets/base/ui/banner5.png');

        this.loadImage('diaryShine', 'assets/base/ui/diary/diaryShine.png');
        this.loadImage('diaryArrowLeft', 'assets/base/ui/diary/diaryArrowLeft.png');
        this.loadImage('bookBg', 'assets/base/ui/diary/bookBg.png');
        this.loadImage('bookPage', 'assets/base/ui/diary/bookPage.png');
        this.loadImage('diaryArrowsBg', 'assets/base/ui/diary/diaryArrowsBg.png');
        // this.loadImage('chooseBtn', 'assets/base/ui/chooseBtn.png');
        // this.loadImage('choosenSlot', 'assets/base/ui/choosenSlot.png');
        // this.loadImage('chooseSlot', 'assets/base/ui/chooseSlot.png');
        this.loadImage('closeBook', 'assets/base/ui/diary/closeBook.png');
        this.loadImage('dialogPnl', 'assets/base/ui/dialogPnl.png');
        // this.loadImage('taskButton', 'assets/base/ui/taskButton.png');
        // this.loadImage('taskButtonEmpty', 'assets/base/ui/taskButtonEmpty.png');
        this.loadImage('actionCircle', 'assets/base/action/actionCircle.png');
        this.loadImage('actionChest', 'assets/base/action/actionChest.png');
        this.loadImage('actionMap', 'assets/base/action/actionMap.png');
        this.loadImage('actionKey', 'assets/base/action/actionKey.png');
        this.loadImage('actionBoiler', 'assets/base/action/actionBoiler.png');
        this.loadImage('loupe', 'assets/base/action/loupe.png');
        this.loadImage('actionHouse', 'assets/base/action/actionHouse.png');
        this.loadImage('actionDoor', 'assets/base/action/actionDoor.png');
        // this.loadImage('taskButtonInactive', 'assets/base/ui/taskButtonInactive.png');
        // this.loadImage('taskPnl', 'assets/base/ui/taskPnl2.png');
        // this.loadImage('taskInfoPnl', 'assets/base/ui/taskInfoPnl.png');
        this.loadImage('titlePnl', 'assets/base/ui/titlePnl.png');

        this.loadImage('actionCream', 'assets/base/action/actionCream.png');
        this.loadImage('actionMushroom', 'assets/base/action/actionMushroom.png');

        // this.loadImage('treeDecor', 'assets/base/ui/tree.png');

        this.loadImage('sparkle', 'assets/base/ui/sparkle.png');
        this.loadImage('glint', 'assets/base/ui/glint.png');


        this.loadImage('grassLight', 'assets/base/ui/grassLight.png');
        this.loadImage('grassDark', 'assets/minigame3/grassDark.png');
        this.loadImage('bg', 'assets/base/ui/bg.jpg');
        this.loadImage('bgHouse', 'assets/minigame2/bgHouse.jpg');
        this.loadImage('bgDark', 'assets/minigame3/bgDark.jpg');
        this.loadImage('bgLake', 'assets/minigame4/bgLake.jpg');
        this.loadImage('bgLight', 'assets/minigame5/bgLight.jpg');
        this.loadImage('bgClover', 'assets/minigame9/bgClover.png');
        this.loadImage('flowersBig', 'assets/minigame5/flowersBig.png');

        this.loadImage('flowersFieldHeader', 'assets/minigame5/flowersFieldHeader.png');
        this.loadImage('mountinesHeader', 'assets/minigame1/mountinesHeader.png');
        this.loadImage('junglesHeader', 'assets/minigame6/junglesHeader.png');
        this.loadImage('bugForestHeader', 'assets/minigame7/bugForestHeader.png');
        this.loadImage('snailForestHeader', 'assets/minigame8/snailForestHeader.png');
        this.loadImage('cloverHeader', 'assets/minigame9/cloverHeader.png');
        this.loadImage('hiveHeader', 'assets/minigame10/hiveheader.png');
        this.loadImage('forestHeader1', 'assets/base/ui/forestHeader1.png');
        this.loadImage('forestHeader2', 'assets/minigame3/forestHeader2.png');

        this.loadImage('envLake', 'assets/other/editor/envLake.png');
        this.loadImage('envJungle', 'assets/other/editor/envJungle.png');
        this.loadImage('envBugForest', 'assets/other/editor/envBugForest.png');
        this.loadImage('envSnailForest', 'assets/other/editor/envSnailForest.png');
        this.loadImage('envMountines', 'assets/other/editor/envMountines.png');
        this.loadImage('envForest', 'assets/other/editor/envForest.png');
        this.loadImage('envDarkForest', 'assets/other/editor/envDarkFrst.png');
        this.loadImage('envFlowerFields', 'assets/other/editor/envFlowerFields.png');
        this.loadImage('envHome', 'assets/other/editor/envHome.png');

        this.loadImage('plusButton', 'assets/base/ui/plusButton.png');



        this.loadImage('rainbow', 'assets/chapter1/forest/rainbow.png');
        this.loadImage('watermill', 'assets/chapter1/forest/watermill.png');
        this.loadImage('cat3floar', 'assets/chapter1/forest/cat3floar.png');
        this.loadImage('tent', 'assets/chapter1/forest/tent.png');
        this.loadImage('campfire', 'assets/chapter1/forest/campfire.png');
        this.loadImage('sveta2Mushrooms', 'assets/chapter1/forest/sveta2_mushrooms.png');



        this.loadImage('table', 'assets/minigame2/table.png');
        this.loadImage('carpet', 'assets/minigame2/carpet.png');
        this.loadImage('leafs1', 'assets/minigame2/leafs1.png');
        this.loadImage('leafs2', 'assets/minigame2/leafs2.png');
        this.loadImage('leafs3', 'assets/minigame2/leafs3.png');
        this.loadImage('crack', 'assets/minigame2/crack.png');

        // this.loadImage('lifePanelBg', 'assets/base/ui/lifePanelBg.png');

        //content
        this.loadImage('cat1', 'assets/base/characters/cat1.png');
        this.loadImage('cat2', 'assets/base/characters/cat2.png');
        this.loadImage('cat3', 'assets/base/characters/cat3.png');
        this.loadImage('cat4', 'assets/base/characters/cat4.png');
        this.loadImage('sveta1', 'assets/base/characters/sveta1.png');
        this.loadImage('sveta2', 'assets/base/characters/sveta2.png');
        this.loadImage('sveta3', 'assets/base/characters/sveta3.png');
        this.loadImage('sveta4', 'assets/base/characters/sveta4.png');
        this.loadImage('sveta5', 'assets/base/characters/sveta5.png');
        this.loadImage('sveta6', 'assets/base/characters/sveta6.png');
        this.loadImage('sova1', 'assets/additional/characters/sova1.png');
        this.loadImage('sova2', 'assets/additional/characters/sova2.png');
        this.loadImage('sova3', 'assets/additional/characters/sova3.png');
        this.loadImage('leshii1', 'assets/additional/characters/leshii1.png');
        this.loadImage('leshii2', 'assets/additional/characters/leshii2.png');
        this.loadImage('leshii3', 'assets/additional/characters/leshii3.png');
        this.loadImage('belka1', 'assets/additional/characters/belka1.png');
        this.loadImage('belka2', 'assets/additional/characters/belka2.png');
        this.loadImage('belka3', 'assets/additional/characters/belka3.png');
        this.loadImage('yaga1', 'assets/additional/characters/yaga1.png');
        this.loadImage('yaga2', 'assets/additional/characters/yaga2.png');
        this.loadImage('yaga3', 'assets/additional/characters/yaga3.png');



        this.loadImage('splash1', 'assets/base/room/boiler/splash1.png');
        this.loadImage('splash2', 'assets/base/room/boiler/splash2.png');
        this.loadImage('splash3', 'assets/base/room/boiler/splash3.png');
        this.loadImage('splash4', 'assets/base/room/boiler/splash4.png');

        this.loadImage('p1', 'assets/base/particles/p1.png');
        this.loadImage('p2', 'assets/base/particles/p2.png');
        // this.loadImage('p3', 'assets/base/particles/p3.png');
        // this.loadImage('p4', 'assets/base/particles/p4.png');
        this.loadImage('p5', 'assets/base/particles/p5.png');
        this.loadImage('p6', 'assets/base/particles/p6.png');
        this.loadImage('p7', 'assets/base/particles/p7.png');
        this.loadImage('p8', 'assets/base/particles/p8.png');
        this.loadImage('p9', 'assets/base/particles/p9.png');

        this.loadImage('dust', 'assets/base/particles/dust.png');
        this.loadImage('dustYellow', 'assets/base/particles/dustYellow.png');
        this.loadImage('dustYellow2', 'assets/base/particles/dustYellow2.png');
        this.loadImage('dustRed', 'assets/base/particles/dustRed.png');
        this.loadImage('dustViolet', 'assets/base/particles/dustViolet.png');
        this.loadImage('dustGreen', 'assets/base/particles/dustGreen.png');
        this.loadImage('dustBlue', 'assets/base/particles/dustBlue.png');
        this.loadImage('keyDecor', 'assets/base/scenario/room/chest/key.png');
        this.loadImage('keyRotatedDecor', 'assets/base/scenario/room/chest/keyRotated.png');
        this.loadImage('lock', 'assets/base/scenario/room/chest/lock.png');
        this.loadImage('shining', 'assets/base/scenario/room/chest/light.png');
        // this.loadImage('owl2', 'assets/base/scenario/room/owl2.png');


        this.loadImage('chestBox', 'assets/base/scenario/room/chest/chestBox.png');
        this.loadImage('chestClosed', 'assets/base/scenario/room/chest/chestClosed.png');
        this.loadImage('chestOpened', 'assets/base/scenario/room/chest/chestOpened.png');
        this.loadImage('chestShadow', 'assets/base/scenario/room/chest/chest_shadow100.png');

        // this.loadImage('chest1', 'assets/chapter1/chest1.png');
        // this.loadImage('chest2', 'assets/chapter1/chest2.png');
        this.loadImage('boilBig', 'assets/base/room/boiler/boiler.png');

        this.loadImage('strawberryBucket', 'assets/chapter1/darkForest/strawberryBucket.png');
        this.loadImage('cat1cheeks', 'assets/base/replicaDecor/cat1cheeks.png');
        this.loadImage('replicaHeart', 'assets/base/replicaDecor/heart.png');
        this.loadImage('brokenHeart', 'assets/base/replicaDecor/brokenHeart.png');
        this.loadImage('mirror2', 'assets/base/replicaDecor/mirror2.png');
        this.loadImage('mirror2b', 'assets/base/replicaDecor/mirror2.png');
        this.loadImage('bookDecor', 'assets/base/replicaDecor/book.png');
        this.loadImage('plate1', 'assets/base/replicaDecor/plate1.png');
        this.loadImage('plate2', 'assets/base/replicaDecor/plate2.png');
        // this.loadImage('dishDecor', 'assets/base/replicaDecor/dish.png');
        // this.loadImage('postmanCreamDecor', 'assets/base/replicaDecor/postmanCream.png');
        this.loadImage('question', 'assets/base/replicaDecor/question.png');
        this.loadImage('foo', 'assets/base/replicaDecor/foo.png');
        this.loadImage('idea', 'assets/base/replicaDecor/idea.png');
        this.loadImage('eat', 'assets/base/replicaDecor/eat.png');
        this.loadImage('drink', 'assets/base/replicaDecor/drink.png');
        this.loadImage('keyBig', 'assets/base/replicaDecor/keyBig.png');
        this.loadImage('flyingAcorn', 'assets/base/replicaDecor/flyingAcorn.png');


        //Hex
        this.loadImage('jelly', 'assets/base/hex/jelly.png');
        this.loadImage('jellyMushroom', 'assets/base/hex/jellyMushroom.png');

        this.loadImage('hexFlower', 'assets/base/hex/hexFlower.png');
        this.loadImage('hexSand', 'assets/base/hex/hexSand.png');
        this.loadImage('sandPyramid', 'assets/base/hex/sandPyramid.png');
        this.loadImage('pinkFlower', 'assets/base/hex/pinkFlower.png');
        this.loadImage('sandPyramidg', 'assets/base/hex/sandPyramidG.png');
        this.loadImage('pinkFlowerg', 'assets/base/hex/pinkFlowerG.png');
        this.loadImage('sand', 'assets/base/hex/sand.png');
        this.loadImage('grass', 'assets/base/hex/grass.png');
        this.loadImage('grassFlower', 'assets/base/hex/grassFlower.png');
        this.loadImage('water', 'assets/base/hex/water.png');
        this.loadImage('cactus', 'assets/base/items/cactus.png');

        this.loadImage('lakeHeader', 'assets/minigame4/lakeHeader.png');
        this.loadImage('lakeHeaderDecor', 'assets/base/ui/lakeHeaderDecor.png');

        this.loadImage('cold', 'assets/base/hex/cold.png');
        // this.loadImage('earth', 'assets/base/hex/earth.png');
        // this.loadImage('net', 'assets/base/hex/net.png');
        // this.loadImage('door', 'assets/base/hex/door.png');
        // this.loadImage('doorg', 'assets/base/hex/doorg.png');
        // this.loadImage('ivy', 'assets/base/hex/ivy.png');

        this.loadImage('hexDF', 'assets/base/hex/hexDF.png');
        this.loadImage('hexFrame', 'assets/base/hex/hexFrame.png');
        this.loadImage('hexFrame2', 'assets/base/hex/hexFrame2.png');
        this.loadImage('grassDF', 'assets/base/hex/grassDF.png');
        this.loadImage('hex', 'assets/base/hex/hex.png');
        this.loadImage('hex2', 'assets/base/hex/hex2.png');
        this.loadImage('hexDark', 'assets/base/hex/hexDark.png');
        // this.loadImage('hexCold', 'assets/base/hex/hexCold.png');
        // this.loadImage('hexEarth', 'assets/base/hex/hexEarth.png');
        // this.loadImage('hexRed', 'assets/base/hex/hexRed.png');
        // this.loadImage('hexNet', 'assets/base/hex/hexNet.png');

        this.loadImage('hexWater', 'assets/base/hex/hexWater.png');

        this.loadImage('leaf1', 'assets/base/hex/leaf1.png');
        this.loadImage('leaf1g', 'assets/base/hex/leaf1g.png');
        // this.loadImage('leaf1r', 'assets/base/hex/leaf1r.png');
        this.loadImage('leaf2', 'assets/base/hex/leaf2.png');
        this.loadImage('leaf2g', 'assets/base/hex/leaf2g.png');
        // this.loadImage('leaf2r', 'assets/base/hex/leaf2r.png');
        this.loadImage('leaf3', 'assets/base/hex/leaf3.png');
        this.loadImage('leaf3g', 'assets/base/hex/leaf3g.png');
        // this.loadImage('leaf3r', 'assets/base/hex/leaf3r.png');
        this.loadImage('leaf4', 'assets/base/hex/leaf4.png');
        this.loadImage('leaf4g', 'assets/base/hex/leaf4g.png');
        this.loadImage('leafClover', 'assets/base/hex/leafClover.png');
        this.loadImage('leafCloverg', 'assets/base/hex/leafCloverg.png');
        // this.loadImage('leaf4r', 'assets/base/hex/leaf4r.png');
        // this.loadImage('leaf5', 'assets/base/hex/leaf5.png');
        // this.loadImage('leaf5g', 'assets/base/hex/leaf5g.png');

        // this.loadImage('hive', 'assets/base/hex/hive.png');
        this.loadImage('liana', 'assets/base/hex/liana.png');
        // this.loadImage('liana1', 'assets/base/hex/liana1.png');
        this.loadImage('liana2', 'assets/base/hex/liana2.png');
        this.loadImage('liana3', 'assets/base/hex/liana3.png');
        // this.loadImage('hexLime', 'assets/base/hex/hexLime.png');
        // this.loadImage('hexDesert', 'assets/base/hex/hexDesert.png');
        // this.loadImage('hexViolet', 'assets/base/hex/hexViolet.png');
        this.loadImage('hexMountain', 'assets/base/hex/hexMountain.png');
        this.loadImage('mount', 'assets/base/hex/mount.png');
        this.loadImage('mountg', 'assets/base/hex/mountG.png');
        this.loadImage('drop', 'assets/base/hex/drop.png');
        this.loadImage('dropg', 'assets/base/hex/dropG.png');


        this.loadImage('hexHouse', 'assets/base/hex/hexHouse.png');
        this.loadImage('hexHouseDark', 'assets/base/hex/hexHouseDark.png');
        this.loadImage('hexWood', 'assets/base/hex/hexWood.png');
        this.loadImage('hexChest', 'assets/base/hex/hexChest.png');
        this.loadImage('hexChestg', 'assets/base/hex/hexChestG.png');


        //Environment
        this.loadImage('stone', 'assets/base/items/environment/stone.png');
        this.loadImage('tree', 'assets/base/items/environment/tree.png');
        this.loadImage('beanLeaf', 'assets/base/items/environment/beanLeaf.png');
        this.loadImage('mirror', 'assets/base/items/environment/mirror.png');
        this.loadImage('stump', 'assets/base/items/environment/stump.png');
        this.loadImage('wlilly1', 'assets/base/items/environment/wlilly1.png');
        this.loadImage('wlilly2', 'assets/base/items/environment/wlilly2.png');
        this.loadImage('log', 'assets/base/items/environment/log.png');

        //Items
        this.loadImage('wheat', 'assets/base/items/wheat.png');
        this.loadImage('poleno', 'assets/base/items/poleno.png');
        this.loadImage('voltorna', 'assets/base/items/voltorna.png');

        this.loadImage('book1', 'assets/base/items/book1.png');
        this.loadImage('book2', 'assets/base/items/book2.png');
        this.loadImage('book3', 'assets/base/items/book3.png');
        this.loadImage('lockpick', 'assets/base/items/lockpick.png');
        this.loadImage('boat', 'assets/base/items/boat.png');
        this.loadImage('bee', 'assets/base/items/bee.png');
        this.loadImage('moonflower', 'assets/base/items/moonflower.png');
        this.loadImage('moonflower1', 'assets/base/items/moonflower1.png');
        this.loadImage('moonflowerClosed1', 'assets/base/items/moonflowerClosed1.png');
        this.loadImage('moonflower2', 'assets/base/items/moonflower2.png');
        this.loadImage('moonflowerClosed2', 'assets/base/items/moonflowerClosed2.png');
        this.loadImage('moonflower3', 'assets/base/items/moonflower3.png');
        this.loadImage('moonflowerClosed3', 'assets/base/items/moonflowerClosed3.png');
        // this.loadImage('bottle', 'assets/base/items/bottle.png');
        // this.loadImage('bottleCap', 'assets/base/items/bottleCap.png');
        this.loadImage('hedgehog', 'assets/base/items/hedgehog.png');

        this.loadImage('chamomileSmall', 'assets/base/items/chamomileSmall.png');
        this.loadImage('dragonfly', 'assets/base/items/dragonfly.png');
        this.loadImage('hive', 'assets/base/items/hive.png');
        this.loadImage('mega-hive', 'assets/base/items/hive_big.png');
        this.loadImage('bumblebee', 'assets/base/items/bumblebee.png');
        this.loadImage('honey', 'assets/base/items/honey.png');
        this.loadImage('honey2', 'assets/base/items/honey2.png');
        this.loadImage('mushroom', 'assets/base/items/mushroom.png');
        // this.loadImage('mushroom2', 'assets/base/items/mushroom2.png');
        this.loadImage('mushroom3', 'assets/base/items/mushroom3.png');
        this.loadImage('mushroom4', 'assets/base/items/mushroom4.png');
        this.loadImage('mushroom5', 'assets/base/items/mushroom5.png');
        // this.loadImage('mushroom4', 'assets/base/items/mushroom4.png');
        // this.loadImage('mushroom5', 'assets/base/items/mushroom5.png');
        // this.loadImage('mushroom6', 'assets/base/items/mushroom6.png');
        // this.loadImage('mushroom7', 'assets/base/items/mushroom7.png');
        // this.loadImage('mushroom8', 'assets/base/items/mushroom8.png');
        this.loadImage('acorn', 'assets/base/items/acorn.png');
        this.loadImage('acorn2', 'assets/base/items/acorn2.png');
        this.loadImage('berry', 'assets/base/items/berry.png');
        this.loadImage('berry2', 'assets/base/items/berry2.png');
        // this.loadImage('bell', 'assets/base/items/bell.png');
        this.loadImage('lilly', 'assets/base/items/lilly.png');
        this.loadImage('amber', 'assets/base/items/amber.png');
        this.loadImage('amber2', 'assets/base/items/amber2.png');
        this.loadImage('amber3', 'assets/base/items/amber3.png');
        this.loadImage('clover', 'assets/base/items/clover.png');
        // this.loadImage('bow1', 'assets/base/items/bow1.png');
        // this.loadImage('bow2', 'assets/base/items/bow2.png');
        // this.loadImage('bow3', 'assets/base/items/bow3.png');
        this.loadImage('hat', 'assets/base/items/hat.png');
        this.loadImage('homeHex', 'assets/base/items/homeHex.png');
        this.loadImage('catHex', 'assets/base/items/catHex.png');
        this.loadImage('goldRoot', 'assets/base/items/goldRoot.png');

        this.loadImage('musicTool1', 'assets/chapter1/darkForest/musicTool1.png');
        this.loadImage('musicTool2', 'assets/chapter1/darkForest/musicTool2.png');
        this.loadImage('musicTool3', 'assets/chapter1/darkForest/musicTool3.png');



        // this.loadImage('broom', 'assets/base/items/broom.png');
        // this.loadImage('shovel', 'assets/base/items/shovel.png');
        this.loadImage('ladybug', 'assets/base/items/ladybug.png');
        this.loadImage('ladybugBrush', 'assets/base/ui/ladybugBrush.png');
        this.loadImage('horn', 'assets/base/ui/horn.png');

        this.loadImage('rabbit', 'assets/base/items/rabbit.png');
        this.loadImage('sheep', 'assets/base/items/ship.png');
        this.loadImage('butterfly', 'assets/base/items/butterfly.png');
        this.loadImage('butterfly2', 'assets/base/items/butterfly2.png');
        this.loadImage('bet', 'assets/base/items/bet.png');
        this.loadImage('owl', 'assets/base/items/owl.png');
        this.loadImage('owlPink', 'assets/base/items/owlPink.png');
        this.loadImage('owlFlying', 'assets/base/items/owlFlying.png');
        this.loadImage('fish', 'assets/base/items/fish.png');
        this.loadImage('bird', 'assets/base/items/bird.png');
        this.loadImage('horseshoe', 'assets/base/items/horseshoe.png');

        this.loadImage('bug1', 'assets/base/items/bug1.png');
        this.loadImage('bug2', 'assets/base/items/bug2.png');
        this.loadImage('bug3', 'assets/base/items/bug3.png');
        this.loadImage('duck', 'assets/base/items/duck.png');
        this.loadImage('crab', 'assets/base/items/crab.png');



        // this.loadImage('berry', 'assets/base/items/berry.png');
        this.loadImage('bush', 'assets/base/items/bush.png');
        this.loadImage('bush2', 'assets/base/items/bush2.png');
        this.loadImage('bushberry', 'assets/base/items/bushberry.png');
        this.loadImage('lavanda', 'assets/base/items/lavanda.png');

        this.loadImage('maple', 'assets/base/ui/maple.png');
        this.loadImage('mapleFace', 'assets/base/ui/mapleFace.png');
        this.loadImage('mapleSeed', 'assets/base/ui/mapleSeed.png');


        this.loadImage('chest1', 'assets/base/ui/shop/chest1.png');
        this.loadImage('chest2', 'assets/base/ui/shop/chest2.png');
        this.loadImage('chest3', 'assets/base/ui/shop/chest3.png');
        this.loadImage('chest4', 'assets/base/ui/shop/chest4.png');
        this.loadImage('chest4cap', 'assets/base/ui/shop/chest4cap.png');
        this.loadImage('shopHeader', 'assets/base/ui/shop/header.png');
        this.loadImage('shopNavBg', 'assets/base/ui/shop/nav_bg.png');
        this.loadImage('shopNavSelected', 'assets/base/ui/shop/nav_selected.png');
        this.loadImage('shopBuyItemButton', 'assets/base/ui/shop/buy_item_button.png');
        this.loadImage('shopInfoButton', 'assets/base/ui/shop/info_button.png');
        this.loadImage('shopItemBg', 'assets/base/ui/shop/itemBg.png');
        this.loadImage('shopSkillBravery', 'assets/base/ui/skills/skill_bravery.png');
        this.loadImage('shopSkillEnergy', 'assets/base/ui/skills/skill_energy.png');
        this.loadImage('shopSkillFriendship', 'assets/base/ui/skills/skill_frendship.png');
        this.loadImage('shopSkillKnowledge', 'assets/base/ui/skills/skill_knowledge.png');
        this.loadImage('shopItem1', 'assets/base/ui/items/item1.png');
        this.loadImage('shopItem2', 'assets/base/ui/items/item2.png');
        this.loadImage('shopItem3', 'assets/base/ui/items/item3.png');
        this.loadImage('shopItem4', 'assets/base/ui/items/item4.png');
        this.loadImage('characterPanelBg', 'assets/base/ui/character/character_panel.png');
        this.loadImage('characterPanelBanner', 'assets/base/ui/character/banner.png');
        this.loadImage('characterSkillsBg', 'assets/base/ui/character/skills_bg.png');
        this.loadImage('characterArrowLeft', 'assets/base/ui/character/arrow_left.png');
        this.loadImage('characterArrowRight', 'assets/base/ui/character/arrow_right.png');
        this.loadImage('characterBackpackButton', 'assets/base/ui/character/backpack_button.png');
        this.loadImage('characterShopButton', 'assets/base/ui/character/shop_button.png');
        this.loadImage('characterCloseButton', 'assets/base/ui/character/close_button.png');
        this.loadImage('characterEquippedBg', 'assets/base/ui/character/equipped_bg.png');
        this.loadImage('characterArtifactHighlight', 'assets/base/ui/character/highlight.png');
        this.loadImage('characterSkillInfoButton', 'assets/base/ui/character/info_button1.png');
        this.loadImage('characterArtifactInfoButton', 'assets/base/ui/character/info_button_item.png');
        this.loadImage('characterSlotItemInfoButton', 'assets/base/ui/character/slot_item_info_buttom.png');
        this.loadImage('characterItemInfoDetailsButton', 'assets/base/ui/character/item_info_panel_details.png');
        this.loadImage('characterItemSkillsDetailsBg', 'assets/base/ui/character/item_skills_details_bg.png');
        this.loadImage('characterLevelProgressEmpty', 'assets/base/ui/character/level_progress_empty.png');
        this.loadImage('characterLevelProgressFull', 'assets/base/ui/character/level_progress_full.png');
        // Fallback for new shop art until it is repacked into base atlases.
        this.load.image('shopHeader', 'assets/base/ui/shop/header.png');
        this.load.image('shopNavBg', 'assets/base/ui/shop/nav_bg.png');
        this.load.image('shopNavSelected', 'assets/base/ui/shop/nav_selected.png');
        this.load.image('shopBuyItemButton', 'assets/base/ui/shop/buy_item_button.png');
        this.load.image('shopInfoButton', 'assets/base/ui/shop/info_button.png');
        this.load.image('shopItemBg', 'assets/base/ui/shop/itemBg.png');
        this.load.image('shopSkillBravery', 'assets/base/ui/skills/skill_bravery.png');
        this.load.image('shopSkillEnergy', 'assets/base/ui/skills/skill_energy.png');
        this.load.image('shopSkillFriendship', 'assets/base/ui/skills/skill_frendship.png');
        this.load.image('shopSkillKnowledge', 'assets/base/ui/skills/skill_knowledge.png');
        this.load.image('shopItem1', 'assets/base/ui/items/item1.png');
        this.load.image('shopItem2', 'assets/base/ui/items/item2.png');
        this.load.image('shopItem3', 'assets/base/ui/items/item3.png');
        this.load.image('shopItem4', 'assets/base/ui/items/item4.png');
        this.load.image('characterPanelBg', 'assets/base/ui/character/character_panel.png');
        this.load.image('characterPanelBanner', 'assets/base/ui/character/banner.png');
        this.load.image('characterSkillsBg', 'assets/base/ui/character/skills_bg.png');
        this.load.image('characterArrowLeft', 'assets/base/ui/character/arrow_left.png');
        this.load.image('characterArrowRight', 'assets/base/ui/character/arrow_right.png');
        this.load.image('characterBackpackButton', 'assets/base/ui/character/backpack_button.png');
        this.load.image('characterShopButton', 'assets/base/ui/character/shop_button.png');
        this.load.image('characterCloseButton', 'assets/base/ui/character/close_button.png');
        this.load.image('characterEquippedBg', 'assets/base/ui/character/equipped_bg.png');
        this.load.image('characterArtifactHighlight', 'assets/base/ui/character/highlight.png');
        this.load.image('characterSkillInfoButton', 'assets/base/ui/character/info_button1.png');
        this.load.image('characterArtifactInfoButton', 'assets/base/ui/character/info_button_item.png');
        this.load.image('characterSlotItemInfoButton', 'assets/base/ui/character/slot_item_info_buttom.png');
        this.load.image('characterItemInfoDetailsButton', 'assets/base/ui/character/item_info_panel_details.png');
        this.load.image('characterItemSkillsDetailsBg', 'assets/base/ui/character/item_skills_details_bg.png');
        this.load.image('characterLevelProgressEmpty', 'assets/base/ui/character/level_progress_empty.png');
        this.load.image('characterLevelProgressFull', 'assets/base/ui/character/level_progress_full.png');

        this.loadImage('cankerberry', 'assets/base/items/cankerberry.png');
        this.loadImage('witchMushroom', 'assets/base/items/witchMushroom.png');
        // this.loadImage('blackberry', 'assets/base/items/blackberry.png');
        this.loadImage('blueberry', 'assets/base/items/berry.png');
        this.loadImage('redberry', 'assets/base/items/berry2.png');
        this.loadImage('strawberry', 'assets/base/items/strawberry.png');
        this.loadImage('blackberry', 'assets/base/items/blackberry.png');
        this.loadImage('pearl', 'assets/base/items/pearl.png');
        this.loadImage('shell2', 'assets/base/items/shell2.png');
        this.loadImage('shell', 'assets/base/items/shell.png');
        this.loadImage('plank1', 'assets/base/items/plank1.png');
        this.loadImage('plank2', 'assets/base/items/plank2.png');
        this.loadImage('separator', 'assets/base/ui/separator.png');
        this.loadImage('separator1', 'assets/base/ui/separator1.png');
        this.loadImage('separator2', 'assets/base/ui/separator2.png');
        this.loadImage('separator3', 'assets/base/ui/separator3.png');
        this.loadImage('plank3', 'assets/base/items/plank3.png');
        this.loadImage('amanita', 'assets/base/items/amanita.png');
        this.loadImage('boil', 'assets/base/items/boil.png');
        this.loadImage('feather', 'assets/base/items/feather.png');
        this.loadImage('greenApple', 'assets/base/items/greenApple.png');
        this.loadImage('redApple', 'assets/base/items/redApple.png');
        this.loadImage('key', 'assets/base/items/key.png');
        // this.loadImage('door', 'assets/base/items/door.png');
        this.loadImage('skull', 'assets/base/items/skull.png');
        this.loadImage('milk', 'assets/base/items/milk.png');
        this.loadImage('smth', 'assets/base/items/smth.png');
        this.loadImage('voodoo', 'assets/base/items/voodoo.png');
        this.loadImage('diaryHex', 'assets/base/items/hexDiary.png');

        this.loadImage('t1', 'assets/additional/items/t1.png');
        this.loadImage('t2', 'assets/additional/items/t2.png');
        this.loadImage('t3', 'assets/additional/items/t3.png');
        this.loadImage('t4', 'assets/additional/items/t4.png');
        this.loadImage('t5', 'assets/additional/items/t5.png');
        this.loadImage('t6', 'assets/additional/items/t6.png');
        this.loadImage('t7', 'assets/additional/items/t7.png');
        this.loadImage('t8', 'assets/additional/items/t8.png');
        this.loadImage('t9', 'assets/additional/items/t9.png');
        this.loadImage('t10', 'assets/additional/items/t10.png');
        this.loadImage('t11', 'assets/additional/items/t11.png');
        this.loadImage('t12', 'assets/additional/items/t12.png');
        this.loadImage('t13', 'assets/additional/items/t13.png');
        this.loadImage('t14', 'assets/additional/items/t14.png');
        this.loadImage('t15', 'assets/additional/items/t15.png');
        this.loadImage('t16', 'assets/additional/items/t16.png');
        this.loadImage('t17', 'assets/additional/items/t17.png');
        this.loadImage('t18', 'assets/additional/items/t18.png');
        this.loadImage('t19', 'assets/additional/items/t19.png');
        this.loadImage('t20', 'assets/additional/items/t20.png');
        this.loadImage('t21', 'assets/additional/items/t21.png');
        this.loadImage('t22', 'assets/additional/items/t22.png');
        this.loadImage('t23', 'assets/additional/items/t23.png');
        this.loadImage('t24', 'assets/additional/items/t24.png');
        this.loadImage('t25', 'assets/additional/items/t25.png');
        this.loadImage('t26', 'assets/additional/items/t26.png');
        this.loadImage('t27', 'assets/additional/items/t27.png');
        this.loadImage('t28', 'assets/additional/items/t28.png');
        this.loadImage('t29', 'assets/additional/items/t29.png');
        this.loadImage('t30', 'assets/additional/items/t30.png');
        this.loadImage('t31', 'assets/additional/items/t31.png');
        this.loadImage('t32', 'assets/additional/items/t32.png');
        this.loadImage('t33', 'assets/additional/items/t33.png');
        this.loadImage('t34', 'assets/additional/items/t34.png');
        this.loadImage('t35', 'assets/additional/items/t35.png');

        //diary
        // this.loadImage('bookBottom', 'assets/base/ui/diary/bookBottom.png');
        // this.loadImage('bookTop', 'assets/base/ui/diary/bookTop.png');
        // this.loadImage('bookColor', 'assets/base/ui/diary/bookColor.jpg');
        this.loadImage('circleFlow', 'assets/base/ui/diary/circleFlow.png');
        this.loadImage('circleSign', 'assets/base/ui/diary/circleSign.png');
        this.loadImage('ingredientBg', 'assets/base/ui/diary/ingredientBg.png');

        this.loadImage('forestPic', 'assets/base/ui/diary/forestPic.png');
        this.loadImage('dForestPic', 'assets/base/ui/diary/dForestPic.png');
        this.loadImage('housePic', 'assets/base/ui/diary/housePic.png');
        this.loadImage('fieldsPic', 'assets/base/ui/diary/fieldsPic.png');
        this.loadImage('atticPic', 'assets/base/ui/diary/atticPic.png');

        //map
        this.loadImage('catSad', 'assets/base/ui/map/catSad.png');
        this.loadImage('compassMap', 'assets/base/ui/map/compassMap.png');
        this.loadImage('evilTree', 'assets/base/ui/map/evilTree.png');
        this.loadImage('evilTreeSecond', 'assets/base/ui/map/evilTreeSecond.png');
        this.loadImage('evilTreeThird', 'assets/base/ui/map/evilTreeThird.png');
        this.loadImage('fog', 'assets/base/ui/map/fog.png');
        this.loadImage('mapAim', 'assets/base/ui/map/aim.png');
        this.loadImage('mapAimSecond', 'assets/base/ui/map/aimSecond.png');
        this.loadImage('mapAimThird', 'assets/base/ui/map/aimThird.png');
        this.loadImage('mapAimFourth', 'assets/base/ui/map/aimFourth.png');
        this.loadImage('mapPoint', 'assets/base/ui/map/dot.png');
        this.loadImage('mapBirch', 'assets/base/ui/map/birch.png');
        this.loadImage('mapCat', 'assets/base/ui/map/cat.png');
        this.loadImage('mapHouse', 'assets/base/ui/map/house.png');
        this.loadImage('mapMountain', 'assets/base/ui/map/mountain.png');
        this.loadImage('mapMushroom', 'assets/base/ui/map/mapMushroom.png');
        this.loadImage('jellyMushroomSmall', 'assets/base/ui/map/jellyMushroomSmall.png');
        this.loadImage('mapPath', 'assets/base/ui/map/path.png');
        this.loadImage('mapPine', 'assets/base/ui/map/pine.png');
        this.loadImage('mapPointer', 'assets/base/ui/map/mapPointer.png');
        this.loadImage('mapTent', 'assets/base/ui/map/tent.png');
        this.loadImage('campfireSmall', 'assets/base/ui/map/campfireSmall.png');

        this.loadImage('mountainGlow', 'assets/base/ui/map/mountainGlow.png');
        this.loadImage('snowMap', 'assets/base/ui/map/snowMap.png');
        this.loadImage('darkGrassMap', 'assets/base/ui/map/darkGrass.png');
        this.loadImage('waterMap', 'assets/base/ui/map/water.png');
        this.loadImage('flowersMap', 'assets/base/ui/map/flowers.png');
        this.loadImage('flowersSecondMap', 'assets/base/ui/map/flowersSecond.png');
        this.loadImage('flowersThirdMap', 'assets/base/ui/map/flowersThird.png');

        //Boosters
        this.loadImage('compass', 'assets/base/items/boosters/compass.png');
        this.loadImage('vision', 'assets/base/items/boosters/vision.png');
        this.loadImage('beans', 'assets/base/items/boosters/beans.png');
        this.loadImage('glove', 'assets/base/items/boosters/glove.png');
        this.loadImage('rainbowPotion', 'assets/base/items/boosters/rainbow.png');
        this.loadImage('rainbowPotionBig', 'assets/base/items/boosters/rainbowBig.png');
        this.loadImage('halfrocket', 'assets/base/items/boosters/halfrocket.png');
        this.loadImage('rocket1', 'assets/base/items/boosters/rocket1.png');
        this.loadImage('rocket2', 'assets/base/items/boosters/rocket2.png');
        this.loadImage('rocket3', 'assets/base/items/boosters/rocket3.png');

        //Flowers
        this.loadImage('chamomile', 'assets/base/ui/chamomile.png');
        // this.loadImage('poppy', 'assets/flowers/poppy.png');
        // this.loadImage('knapweed', 'assets/flowers/knapweed.png');

        //EditorUI
        this.loadImage('arrowEditor', 'assets/other/editor/arrow.png');
        this.loadImage('brushSelection', 'assets/other/editor/brushSelection.png');
        this.loadImage('downloadButton', 'assets/other/editor/downloadButton.png');
        this.loadImage('editBtn', 'assets/other/editor/editBtn.png');
        this.loadImage('editReplicaBtn', 'assets/other/editor/editReplicaBtn.png');
        this.loadImage('editorBottomPanel', 'assets/other/editor/editorBottomPanel.png');
        this.loadImage('editorTopPanel', 'assets/other/editor/editorTopPanel.png');
        this.loadImage('newButton', 'assets/other/editor/newButton.png');
        this.loadImage('objectBg', 'assets/other/editor/objectBg.png');
        this.loadImage('openButton', 'assets/other/editor/openButton.png');
        this.loadImage('playButtonEditor', 'assets/other/editor/playButton.png');
        this.loadImage('playMaxButtonEditor', 'assets/other/editor/playButtonMax.png');
        this.loadImage('playAutoButtonEditor', 'assets/other/editor/playButtonAuto.png');
        this.loadImage('renameButton', 'assets/other/editor/renameButton.png');
        this.loadImage('editorPlusButton', 'assets/other/editor/editorPlusButton.png');
        this.loadImage('saveButton', 'assets/other/editor/saveButton.png');
        this.loadImage('v', 'assets/other/editor/v.png');
        this.loadImage('vm', 'assets/other/editor/vm.png');
        this.loadImage('v1', 'assets/other/editor/v1.png');
        this.loadImage('vm1', 'assets/other/editor/vm1.png');

        this.loadImage('panelCorner', 'assets/base/ui/panelCorner.png');
        this.loadImage('panelBody', 'assets/base/ui/panelBody.png');

        this.loadImage('editorNextButton', 'assets/other/editor/editorNextButton.png');
        this.loadImage('editorArrowPanel', 'assets/other/editor/editorArrowPanel.png');
        this.loadImage('editorArrow2Panel', 'assets/other/editor/editorArrow2Panel.png');
        this.loadImage('editorButtonPanel', 'assets/other/editor/editorButtonPanel.png');
        this.loadImage('editorValuePanel', 'assets/other/editor/editorValuePanel.png');
        this.loadImage('exportIcon', 'assets/other/editor/exportIcon.png');
        this.loadImage('folderIcon', 'assets/other/editor/folderIcon.png');
        this.loadImage('glintDeleteButton', 'assets/other/editor/glintDeleteButton.png');
        this.loadImage('glintIcon', 'assets/other/editor/glintIcon.png');
        this.loadImage('moveIcon', 'assets/other/editor/moveIcon.png');
        this.loadImage('importIcon', 'assets/other/editor/importIcon.png');
        this.loadImage('playIcon', 'assets/other/editor/playIcon.png');
        this.loadImage('repeatIcon', 'assets/other/editor/repeatIcon.png');
        this.loadImage('resetIcon', 'assets/other/editor/resetIcon.png');
        this.loadImage('switchIcon', 'assets/other/editor/switchIcon.png');
        this.loadImage('winButton', 'assets/other/editor/winButton.png');
        this.loadImage('plusOne', 'assets/other/editor/plusOne.png');
        this.loadImage('minusOne', 'assets/other/editor/minusOne.png');


        this.loadImage('fadeStrip', 'assets/base/ui/fadeStrip.png');
        this.loadImage('arrowSmall', 'assets/base/ui/arrowSmall.png');

        this.loadImage('snowflake1', 'assets/base/particles/snowflake1.png');
        this.loadImage('snowflake2', 'assets/base/particles/snowflake2.png');
        this.loadImage('snowflake3', 'assets/base/particles/snowflake3.png');
        this.loadImage('petalRed', 'assets/base/particles/petalRed.png');
        this.loadImage('petalWhite', 'assets/base/particles/petalWhite.png');
        this.loadImage('petalBlue', 'assets/base/particles/petalBlue.png');
        this.loadImage('petalBrown', 'assets/base/particles/petalBrown.png');
        this.loadImage('petalSky', 'assets/base/particles/petalSky.png');
        this.loadImage('petalPink', 'assets/base/particles/petalPink.png');
        this.loadImage('petalGreen', 'assets/base/particles/petalGreen.png');
        this.loadImage('petalOrange', 'assets/base/particles/petalOrange.png');
        this.loadImage('splashV', 'assets/base/particles/splashV.png');
        this.loadImage('splashY', 'assets/base/particles/splashY.png');
        this.loadImage('splashG', 'assets/base/particles/splashG.png');

        this.loadImage('vaxDrop', 'assets/base/room/vaxDrop.png');
        this.loadImage('flame1', 'assets/base/room/flame1.png');
        this.loadImage('flame2', 'assets/base/room/flame2.png');
        this.loadImage('flame3', 'assets/base/room/flame3.png');

        this.loadImage('note1', 'assets/base/scenario/room/notes/note1.png');
        this.loadImage('note2', 'assets/base/scenario/room/notes/note2.png');
        this.loadImage('note3', 'assets/base/scenario/room/notes/note3.png');
        this.loadImage('note4', 'assets/base/scenario/room/notes/note4.png');
        this.loadImage('line1', 'assets/base/scenario/room/notes/line1.png');
        this.loadImage('liquid', 'assets/base/room/boiler/liquid.png');
        // this.loadImage('vid1', 'assets/other/vid1.png');
        // this.loadImage('vid2', 'assets/other/vid2.png');

        this.loadImage('turnOff', 'assets/basehq/turnOff.png');
        this.loadImage('sound1', 'assets/basehq/sound1.png');
        this.loadImage('sound2', 'assets/basehq/sound2.png');
        this.loadImage('support', 'assets/basehq/support.png');
        this.loadImage('settingsMain', 'assets/basehq/settingsMain.png');
        
        this.loadImage('lukoshkoIcon', 'assets/event1/lukoshko.png');
        this.loadImage('lukoshkoIcon2', 'assets/event1/lukoshko2.png');
        this.loadImage('lukoshkoHeader', 'assets/event1/lukoshkoHeader.png');
        this.loadImage('leshiiSign', 'assets/event1/leshiiSign.png');
        this.loadImage('circleViolet', 'assets/event1/circleViolet.png');
        this.loadImage('clock', 'assets/event1/clock.png');
        //audio
        this.game.load.audio("bushHit2", "assets/other/audio/bushHit2.mp3");
        this.game.load.audio("bushMoving", "assets/other/audio/bushMoving.mp3");
        this.game.load.audio("beeSting", "assets/other/audio/bee_sound.mp3");
        this.game.load.audio("click", "assets/other/audio/click.mp3");
        this.game.load.audio("collect3", "assets/other/audio/collect3.mp3");
        this.game.load.audio("compass", "assets/other/audio/compass.mp3");
        this.game.load.audio("crack1", "assets/other/audio/crack1.mp3");
        this.game.load.audio("crack2", "assets/other/audio/crack2.mp3");
        this.game.load.audio("door", "assets/other/audio/door.ogg");
        // this.game.load.audio("forest", "assets/other/audio/forest.ogg");
        this.game.load.audio("forestSounds1", "assets/other/audio/forestSounds1.mp3");
        this.game.load.audio("forestSounds2", "assets/other/audio/forestSounds2.mp3");
        this.game.load.audio("heartBit", "assets/other/audio/heartBit.mp3");
        // this.game.load.audio("houseItemFound", "assets/other/audio/houseItemFound.mp3");
        this.game.load.audio("itemFound", "assets/other/audio/itemFound.mp3");
        this.game.load.audio("jellyAppear", "assets/other/audio/jellyAppear.mp3");
        this.game.load.audio("jellyBlob", "assets/other/audio/jellyBlob.mp3");
        // this.game.load.audio("ladybugMoving", "assets/other/audio/ladybugMoving.wav");
        // this.game.load.audio("loose", "assets/other/audio/loose.wav");
        this.game.load.audio("mushroomTaking", "assets/other/audio/mushroomTaking.mp3");
        this.game.load.audio("plank", "assets/other/audio/plank.mp3");
        this.game.load.audio("rocket", "assets/other/audio/rocket.mp3");
        this.game.load.audio("trouble", "assets/other/audio/trouble.ogg");
        this.game.load.audio("trouble2", "assets/other/audio/trouble2.mp3");
        this.game.load.audio("whooshIn", "assets/other/audio/whooshIn.mp3");
        this.game.load.audio("whooshIn2", "assets/other/audio/whooshIn2.mp3");
        this.game.load.audio("whooshOut", "assets/other/audio/whooshout.mp3");
        this.game.load.audio("whooshOut2", "assets/other/audio/whooshout2.mp3");
        this.game.load.audio("win", "assets/other/audio/win.ogg");
        this.game.load.audio("win2", "assets/other/audio/win2.mp3");
        this.game.load.audio("win3", "assets/other/audio/win3.mp3");
        // this.game.load.audio("win4", "assets/other/audio/win4.wav");
        // this.game.load.audio("forestSounds3", "assets/other/audio/forestSounds3.wav");
    }

    protected playAnimation(animationId: string) { }
}

