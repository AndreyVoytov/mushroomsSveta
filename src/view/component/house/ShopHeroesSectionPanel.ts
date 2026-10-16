import ShopSectionPanel from './ShopSectionPanel';
import HeroTeamPanel from '../forest/HeroTeamPanel';
import Label from '../panel/Label';
import UiLayout from '../../../core/utils/UiLayout';
import LocalizationService from '../../../core/localization/LocalizationService';

export default class ShopHeroesSectionPanel extends ShopSectionPanel {
    private heroes: HeroTeamPanel;

    constructor(game: Phaser.Game) {
        super(game, "heroesSection");
        const board = this.attachSprite('panel2', 'heroNotice');
        board.position.set(0, -50);board.width = 780;board.height = 480;
        const title = this.attachText('partyTitle', LocalizationService.get('ui.heroParty', 'Отряд'), {font:'42px Lora',fill:'#142b2d'});
        title.position.set(0, -231);UiLayout.fit(title, 520, 60);
        this.heroes = new HeroTeamPanel(game, 0, -65, false);this.addChild(this.heroes);
        const note = this.attachText('heroesNote', LocalizationService.get('ui.shopHeroesSoon', LocalizationService.isRussian()
            ? 'Новые герои появятся в следующих главах.' : 'New heroes will arrive in future chapters.'), {font:'32px Manrope',fill:Label.INK,align:'center'});
        note.position.set(0, 83);UiLayout.fit(note, 560, 94, true);
    }

    public showSection(animate?: boolean): void {this.heroes.refresh();super.showSection(animate);}
}
