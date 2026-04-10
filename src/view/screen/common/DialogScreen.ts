import UserService from '../../../core/service/UserService';
import ForestReplicasConfiguration from '../../../core/configuration/ForestReplicasConfiguration';
import EventReplicasConfiguration from '../../../core/configuration/EventReplicasConfiguration';
import BlackPanel from './../../component/panel/BlackPanel';
import DialogPanel from './../../component/dialog/DialogPanel';
import ForestScreen from './../ForestScreen';
import BaseScreen from "./BaseScreen";
import ReplicaDao from '../../../core/dao/ReplicaDao';
import EventUtils from '../../../core/utils/EventUtils';

export default abstract class DialogScreen extends BaseScreen {

    public dialogPanel: DialogPanel;
    protected blackPanel: BlackPanel;
    private onClickAnimations: string[] = [];

    public create(): void {
        if (this instanceof ForestScreen) {
            this.dialogPanel = new DialogPanel(this.game, this, (animation:string) => this.playAnimation(animation),
             () => {
                 if (EventUtils.hasActiveLevelSession()) {
                     return EventReplicasConfiguration.getForestReplica(UserService.getUser());
                 }
                 return ForestReplicasConfiguration.getReplica(UserService.getUser());
             });
        } else {
            this.dialogPanel = new DialogPanel(this.game, this, (animation:string) => this.playAnimation(animation),
             () => {
                 return EventReplicasConfiguration.getHouseReplica(UserService.getUser())
                     || ReplicaDao.getEntity().getReplica(UserService.getUser());
             });
        }

        this.dialogPanel.fixedToCamera = false;
        this.addDialogOverlayPanel(this.dialogPanel);
        this.blackPanel = new BlackPanel(this.game);
    }

    protected onMouseUp(event: MouseEvent): void {
        this.dialogPanel.updateReplica();

        if (this.onClickAnimations && !this.isLocked()) {

            this.onClickAnimations.forEach(a => {
                this.playAnimation(a);
            })
            this.onClickAnimations = [];
        }
    }

    public setOnClickAnimation(animationId: string): void {
        this.onClickAnimations = [animationId];
    }
    public setOnClickAnimations(animationIds: string[]): void {
        this.onClickAnimations = animationIds;
    }

    protected abstract playAnimation(animationId: string): void;

    public onDialogClosing(_delay?: number): void { }

    public onDialogEnd(): void { }
}




