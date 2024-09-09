export default class DelayableAction{
    private game:Phaser.Game;
    private timerEvent: Phaser.TimerEvent;
    private fireAt = null;
    private action: ()=> void;

    constructor(game:Phaser.Game, action: ()=> void){
        this.game = game;
        this.action = action;
    }

    public delay(time:number){
        // console.log(new Date().getTime() + "Delayed action: try set delay to " + time)
        if(!this.fireAt || this.fireAt < new Date().getTime() + time){
            // console.log(new Date().getTime() + "Delayed action: delay succesfully set to " + time )

            this.fireAt = new Date().getTime() + time;

            if(this.timerEvent){
                this.timerEvent.timer.remove(this.timerEvent);
            }
            this.timerEvent = this.game.time.events.add(time, () => {
                // console.log(new Date().getTime() + "Delayed action fires!")
                this.action();
            })
        }
    }

    public clear(){
        this.fireAt = null;
        if(this.timerEvent){
            this.timerEvent.timer.remove(this.timerEvent);
        }
    }

}
