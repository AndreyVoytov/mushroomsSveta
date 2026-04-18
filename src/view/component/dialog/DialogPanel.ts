import DialogScreen from '../../screen/common/DialogScreen';
import Preset from '../../game/Preset';
import UserService from '../../../core/service/UserService';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import BasePanel from '../../component/panel/BasePanel';
import ReplicaPanel from './ReplicaPanel';
import { DIALOG_BOTTOM_PADDING } from './DialogLayoutMetrics';
import StripsPanel from './StripsPanel';
import RewardUtils from '../../../core/utils/RewardUtils';
import ForestScreen from '../../screen/ForestScreen';
import HouseScreen from '../../screen/HouseScreen';
export default class DialogPanel extends BasePanel {
    private screen: DialogScreen;

    private playAnimation: (animation: string)=> void;
    public getNextReplica:()=>ReplicaType;

    public replicaPanel: ReplicaPanel;

    private stripsPanel: StripsPanel;

    public diaryPreset: Preset;

    public static BOTTOM_PADDING = DIALOG_BOTTOM_PADDING;

    private lastReplicaAt = new Date().getTime();

    public replicaDelay = 0;
    private rewardGrantedReplicaId: string = null;

    constructor(game: Phaser.Game, screen: DialogScreen, playAnimationCallback: (animation: string)=> void, nextReplicaCallback: ()=>ReplicaType) {
        super(game, 0, 0);

        this.fixedToCamera = false;

        this.screen = screen;
        this.addChild(this.stripsPanel = new StripsPanel(this.game, screen));
        this.playAnimation = playAnimationCallback;
        this.getNextReplica = nextReplicaCallback;

        // this.taskNewPanel = null;

        this.replicaPanel = null;

        this.inputEnabled = false;
    }

    public isDialogActive(): boolean {
        return !!this.replicaPanel || this.stripsPanel.isActive();
    }

    public skip() {
        let user = UserService.getUser();
        this.screen.setOnClickAnimations([]); //не сработало

        let previousReplicaPanel = this.replicaPanel;
        let nextReplica = this.getNextReplica();

        while (nextReplica != null) {
            // if (nextReplica.setMarkerBefore) {
            //     user.addMarker(nextReplica.setMarkerBefore);
            // }
            // if (nextReplica.setMarkerAfter) {
            //     user.addMarker(nextReplica.setMarkerAfter);
            // }
            if (nextReplica.location) {
                user.setLocation(nextReplica.location);
            }
            if (nextReplica.rewards && nextReplica.rewards.length > 0) {
                RewardUtils.applyRewards(user, nextReplica.rewards);
            }
            user.addCompletedReplica(nextReplica.id);
            nextReplica = this.getNextReplica();
        }

        if (previousReplicaPanel) {
            // if (this.taskNewPanel) {
            //     this.taskNewPanel.hide(200);
            // }
            let delay = ReplicaPanel.HIDE_DIALOG_DURATION + ReplicaPanel.LAST_HIDE_PERSON_DURATION - 100;
            this.screen.onDialogClosing(delay);
            this.stripsPanel.hideStrips(delay);
            this.game.time.events.add(delay + 300, () => this.screen.onDialogEnd())
            previousReplicaPanel.lastHide();
            this.replicaPanel = null;
        }

        this.playAnimation("goToForest"); //for house
        this.playAnimation("winLevel") //for forest
    }

    public updateReplica(ignoreLockedScreen?: boolean, noAnimation?:boolean, notSaveCompletedReplica?: boolean): string {

        if(this.replicaPanel && !this.replicaPanel.isShown()){
            return;
        }
        
        if(this.replicaPanel && this.replicaPanel.isPrinting()){
            console.log("STOP PRINTING!")
            this.replicaPanel.stopPrinting();
            return;
        }

        let user = UserService.getUser();

        if (!ignoreLockedScreen && this.screen.isLocked()) {
            console.log("CAN NOT UPDATE REPLICA; SCREEN IS LOCKED!")
            return;
        }

        console.log("REPLICA UPDATE!!");

        this.screen.bringDialogOverlayToFront();
        this.bringToTop();

        let previousReplicaPanel = this.replicaPanel;
        let currentReplica = this.getNextReplica();

        let lockTime = 0;
        if (!ignoreLockedScreen && currentReplica != null) {
            const hasIntroPanel = currentReplica.showDiary || !!currentReplica.panelItem;
            lockTime = (hasIntroPanel ? 1500 : 1000) + (hasIntroPanel && screen instanceof ForestScreen? 1000 : 0);
        }

        let nextReplica = currentReplica;

        if (previousReplicaPanel != null) {
            console.log("PREVIOUS REPLICA IS NOT NULL! : " + previousReplicaPanel.r.text)
            if (currentReplica != null && !notSaveCompletedReplica) {
                console.log("CURRENT REPLICA IS NOT NULL! : " + currentReplica.id)
                if (currentReplica.rewards && currentReplica.rewards.length > 0 && this.rewardGrantedReplicaId != currentReplica.id) {
                    let rewards = RewardUtils.cloneRewards(currentReplica.rewards);
                    this.screen.showRewardItems(rewards, () => {
                        RewardUtils.applyRewards(user, rewards);
                        this.rewardGrantedReplicaId = currentReplica.id;
                        this.game.time.events.add(1, () => {
                            if (this.parent) {
                                this.updateReplica(true, noAnimation, notSaveCompletedReplica);
                            }
                        });
                    });
                    return;
                }
                // if (currentReplica.setMarkerAfter) {
                //     user.addMarker(currentReplica.setMarkerAfter);
                // }
                if (currentReplica.afterLevelLocation) {
                    user.setAfterLevelLocation(currentReplica.afterLevelLocation);
                }
                // if(currentReplica.location){
                //     user.setLocation(currentReplica.location)
                // }
                // if (currentReplica.afterAnimation) {
                //     this.playAnimation(currentReplica.afterAnimation);
                // }
                // if (currentReplica.afterAnimationDuration) {
                //     lockTime = currentReplica.afterAnimationDuration;
                // }
                user.addCompletedReplica(currentReplica.id);
                if (this.rewardGrantedReplicaId == currentReplica.id) {
                    this.rewardGrantedReplicaId = null;
                }
            }
            nextReplica = this.getNextReplica();
        }

        if(nextReplica != null && (previousReplicaPanel == null || previousReplicaPanel.r.id != nextReplica.id ) && !noAnimation ){
            console.log("NEXT REPLICA: " + nextReplica.text)

            if(nextReplica.delay && this.replicaDelay == 0){
                console.log("SETUP DELAY;  nextReplica.delay: " + nextReplica.delay)
                console.log("SETUP DELAY;  this.replicaDelay: " + this.replicaDelay)
                this.replicaDelay = nextReplica.delay;
                this.lastReplicaAt = new Date().getTime();

                if (nextReplica.beforeAnimation) {
                    this.bringToTop();
                    this.playAnimation(nextReplica.beforeAnimation);

                    if(!this.stripsPanel.isActive()){
                        this.stripsPanel.showStrips(0);
                    }
                    if(this.replicaPanel){
                        this.replicaPanel.bringToTop();
                    }
                }

                if(previousReplicaPanel){
                    previousReplicaPanel.lastHide();
                    this.replicaPanel = null;
                }
            }
        }

        // console.log("MILLIMILLIS: " + new Date().getTime())
        // console.log("lastReplicaAt: " + this.lastReplicaAt)
        // console.log("replicaDelay: " + this.replicaDelay)

        let delayleft = this.lastReplicaAt + this.replicaDelay - new Date().getTime();

        if(delayleft > 0 && !noAnimation){
            this.game.time.events.add(delayleft + 1, () => {
                this.updateReplica(true, noAnimation, notSaveCompletedReplica);
            })
            console.log("CAN NOT UPDATE REPLICA; REPLICA DELAYED!")
            return;
        }

        this.replicaDelay = 0;
        this.lastReplicaAt = new Date().getTime();

        if (lockTime) {
            this.game.time.events.add(50, () => {
                this.screen.lockScreenFor(lockTime)
            });
        }

        if (nextReplica == null) {
            if (previousReplicaPanel) {

                // if (this.taskNewPanel) {
                //     this.taskNewPanel.hide(200);
                // }
                let delay = ReplicaPanel.HIDE_DIALOG_DURATION + ReplicaPanel.LAST_HIDE_PERSON_DURATION - 100;
                this.screen.onDialogClosing(delay);
                this.stripsPanel.hideStrips(delay);
                this.game.time.events.add(delay + 300, () => this.screen.onDialogEnd())
                previousReplicaPanel.lastHide();

                this.replicaPanel = null;
            }
        } else {
            this.replicaPanel = new ReplicaPanel(this.game, this, 0, this.game.height - 280 - DialogPanel.BOTTOM_PADDING, nextReplica,
                this.playAnimation, this.diaryPreset);

            this.replicaPanel.fixedToCamera = false;
            this.addChild(this.replicaPanel);

            if (nextReplica.afterAnimation && !noAnimation) {
                this.game.time.events.add(100, () => {
                    this.screen.setOnClickAnimation(nextReplica.afterAnimation);
                }, this)
            }

            if (previousReplicaPanel) {
                previousReplicaPanel.replaceWith(this.replicaPanel)
                // this.replicaPanel.show();
                // previousReplicaPanel.hide();
                // if (this.taskNewPanel) {
                //     this.taskNewPanel.hide(200);
                // }
            } else {
                this.stripsPanel.showStrips(0);
                this.replicaPanel.alpha = 0;
                this.game.time.events.add(500, () => {
                    if (this.replicaPanel) {
                        this.replicaPanel.firstShow();
                    }
                }, this)
            }

            // console.log("PRESENT TASK: " + nextReplica.presentTask)
            // if(nextReplica.presentTask){
            //     let task = TasksConfiguration.allTasks.filter(task => task.id == nextReplica.presentTask).shift();
            //     if(task){ 
            //         console.log("PRESENT TASK!!!")
            //         this.taskNewPanel = new TaskNewPanel(this.game, this.game.width + 150, 280, task);
            //         this.addSprite(this.taskNewPanel);
            //         this.taskNewPanel.show(500);
            //     } else {
            //         console.log("WARNING! UNKNOWN PRESENTED TASK ID: " + nextReplica.presentTask)
            //     }
            // }

            // if (nextReplica.setMarkerBefore) {
            //     user.addMarker(nextReplica.setMarkerBefore);
            // }


            this.game.kineticScrolling.stop();
        }
    }

}
