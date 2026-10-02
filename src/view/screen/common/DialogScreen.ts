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
        const clickAnimations = this.onClickAnimations;
        if (clickAnimations && clickAnimations.length > 0) {
            // Replica action buttons can appear just before their short input
            // lock expires. Advance the replica for this explicit click even
            // while locked, otherwise the button disables itself and the
            // location transition never runs.
            this.dialogPanel.updateReplica(true, false, false, true);
            clickAnimations.forEach(animation => this.playAnimation(animation));
            this.onClickAnimations = [];
        } else {
            this.dialogPanel.updateReplica();
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




