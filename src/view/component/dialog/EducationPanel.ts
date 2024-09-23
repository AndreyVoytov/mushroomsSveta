import CellType from '../../../core/model/enum/CellType';
import Movable from '../../../core/model/forest/Movable';
import BaseForestScreen from '../../screen/BaseForestScreen';
import ForestsDao from '../../../core/dao/ForestDao';
import UserService from '../../../core/service/UserService';
import AimType from '../../../core/model/enum/AimType';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import Utils from './../../../core/utils/Utils';
import ForestAim from '../../../core/model/forest/ForestAim';
import CellState from '../../../core/model/forest/CellState';
import ForestCell from '../../../core/model/forest/ForestCell';
import ForestType from './../../../core/model/forest/ForestType';
import ForestScreen from './../../screen/ForestScreen';
import BasePanel from '../../component/panel/BasePanel';
import EducationCover from './../forest/EducationCover';
import HelperPanel from './../forest/HelperPanel';
import { ContentType, ItemContents } from '../../../core/model/enum/ContentType';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import SpecialItemsConfiguration from '../../../core/configuration/SpecialItemsConfiguration';
import ForestUtils from '../../../core/utils/ForestUtils';
import { Easing } from 'phaser-ce';
import ComplexAnimationUtils from '../../../core/utils/ComplexAnimationUtils';
export default class EducationPanel extends BasePanel {

    public shownWithOkButton: boolean;
    public shown: boolean;

    private educationCover: EducationCover;
    private arrow: Phaser.Sprite;

    private forestType: ForestType;
    private cells: ForestCell[];
    private ladybugs: Movable[];
    private aims: ForestAim[];
    private screen: BaseForestScreen;

    private helperPanel: HelperPanel;
    public centerCell: ForestCell;
    private lastOpenedCount: number;

    private fieldStartY: number;

    constructor(game: Phaser.Game, screen: BaseForestScreen, cells: ForestCell[], ladybugs: Movable[], aims: ForestAim[], forestType: ForestType, fieldStartY: number) {
        super(game, 0, 0);
        this.game = game;
        this.forestType = forestType;
        this.cells = cells;
        this.aims = aims;
        this.screen = screen;
        this.fieldStartY = fieldStartY;
        this.ladybugs = ladybugs;
    }

    public showEducation(cellState: CellState, openedCells: number) {
        let level = ForestsDao.indexOf(this.forestType);
        level += 1;
        console.log("TUTORIAL: level " + level + "; openedCells: " + openedCells)
        if (level == 1) {
            if (openedCells == 0) {
                this.doShowEducation("~Открывайте клеточки~, чтобы собирать грибы", "sveta1", this.cells, CoverMode.aimVisible, 200, null);
            } else if (openedCells == 1) {
                this.hideEducation(0);
                this.forceOpenCell(cellState, ContentType.mushroom);
            } else if (openedCells == 2) {
                this.forceOpenTree(cellState);

                let openedCell = this.cells.filter(cell => cell.state == cellState).shift();
                let adjucentCells = this.cells.filter(cell => this.screen.cellsProvider.areAdjucent(cell, openedCell));
                adjucentCells.push(openedCell);
                let mushroomsCount = adjucentCells.filter(cell => cell.state.content == ContentType.mushroom && !cell.state.opened).length;
                this.doShowEducation("Рядом с ~деревом~ " + mushroomsCount + Utils.chooseRussianWord(mushroomsCount, " гриб", " гриба", " грибов") +
                    ". Соберите " + (mushroomsCount == 1 ? " его!" : "их все!"),
                    "sveta1", adjucentCells, CoverMode.noneVisible, 100, openedCell);

                this.arrow = SpriteUtils.createSprite(this.game, openedCell.state.sprite.x,
                    openedCell.state.sprite.y - openedCell.state.sprite.height / 2 + 10, "arrow");
                this.arrow.alpha = 0;
                this.game.add.existing(this.arrow);
                this.arrow.anchor.set(0.5, 1);
                AnimationUtils.jump(this.game, this.arrow, 0)
                AnimationUtils.fadeIn(this.game, this.arrow, 200)

            } else if (this.centerCell != null) {
                if (cellState.content == ContentType.tree) {
                    SpriteUtils.loadTexture(cellState.sprite, Utils.getRandomElement([ContentType[ContentType.stone], ContentType[ContentType.log], ContentType[ContentType.stump]]))
                }
                let notOpenedMushrooms = this.cells.filter(cell => this.screen.cellsProvider.areAdjucent(this.centerCell, cell) && !cell.state.opened && cell.state.content == ContentType.mushroom).length;
                if (notOpenedMushrooms == 0) {
                    this.centerCell = null;
                    this.hideEducation(0)

                    let leftCount = this.cells.filter(cell => !cell.state.opened && cell.state.content == ContentType.mushroom).length;

                    this.doShowEducation("Отлично! осталось собрать " + leftCount +
                        Utils.chooseRussianWord(leftCount, " гриб!", " гриба!", " грибов!"), "sveta1", this.cells, CoverMode.aimVisible, 500, null);

                    this.screen.setOnClickAnimation("hideEducation")
                    this.arrow = SpriteUtils.createSprite(this.game, this.game.width / 2,
                        242, "arrow");
                    this.game.add.existing(this.arrow);
                    this.arrow.anchor.set(0.5, 0);
                    this.arrow.scale.set(1, -1);
                    AnimationUtils.jump(this.game, this.arrow, 0)
                    AnimationUtils.fadeIn(this.game, this.arrow, 900)
                }
            } else if (openedCells == this.lastOpenedCount + 1) {
                this.hideEducation(0);
            }
        } else if (level == 2) {

            if (openedCells == 0) {
                this.doShowEducation("Встречи со ~зверями~ прибавляют ходы!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["rabbit", "butterfly", "bet"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }

            this.showSpecificCellOnItemAimsLeft(cellState, /*"homeHex",*/ 0, () => {
                UserService.getUser().addMarker("homeFound")
                this.doShowDialogOnSpecificItem(cellState);
                // this.screen.setOnClickAnimation("exploreHouse");
            })
        } else if (level == 3) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 4) {
            this.showSpecificCellOnItemAimsLeft(cellState, /* "diaryHex",*/ 0, () => {
                cellState.content = ContentType.specificItem;
                let openedCell = this.cells.filter(cell => cell.state == cellState).shift();
                this.doShowEducation(null, null, [openedCell], CoverMode.noneVisible, 200, null);

                this.screen.stopLevelForDialog();
                this.screen.lockScreenFor(2000);
                this.screen.playAnimation("showDiary");

                this.game.time.events.add(100, () => {
                    UserService.getUser().addMarker("notebookFound")
                    this.screen.dialogPanel.updateReplica(true);

                    this.screen.setOnClickAnimations(["winLevel"]);
                    // this.screen.setOnClickAnimations(["hideDiary", "winLevel"]);
                })
            })
        } else if (level == 5) {
            if (openedCells == 0) {
                this.doShowEducation("Вскройте соседние клетки, чтобы освободить ячейку     от ~зарослей~!", "sveta1", this.cells, CoverMode.noneVisible, 200, null);
            } else if (openedCells == 1) {
                this.hideEducation(0);
            }
        } else if (level == 7) {
            if (openedCells == 0) {
                let compassCell = this.cells.filter(c => c.type == CellType.COMPASS_FREE)[0];
                this.doShowEducation("Смотрите, ~компас~! Активируйте его нажатием", "sveta1", [compassCell],
                    CoverMode.noneVisible, 200, null);

                this.arrow = SpriteUtils.createSprite(this.game, compassCell.state.sprite.x,
                    compassCell.state.sprite.y - compassCell.state.sprite.height / 2 + 25, "arrow");
                this.game.add.existing(this.arrow);
                this.arrow.anchor.set(0.5, 1);
                this.arrow.scale.set(1, 1);
                AnimationUtils.jump(this.game, this.arrow, 0)
                AnimationUtils.fadeIn(this.game, this.arrow, 900)
            } else if (openedCells >= 1) {
                this.hideEducation();
            }
        } else if (level == 9) {
            if (openedCells == 0) {
                this.doShowEducation("Откройте ячейку, чтобы ~коровка~ спустилась", "sveta1",
                    this.cells.filter(c => { return c.Y == 0 && (c.X == 3 || c.X == 4) }), CoverMode.showMessageAtCenterPlus200, 200, null);
                this.ladybugs[0].sprite.bringToTop();
            } else if (openedCells == 1) {
                this.hideEducation();

                this.game.time.events.add(300, () => {
                    this.doShowEducation("Продолжайте, пока коровка не окажется в ~самом низу~!", "sveta1",
                        this.cells, CoverMode.noneVisible, 500, null);
                    this.ladybugs[0].sprite.bringToTop();
                })

            } else if (openedCells == 2) {
                this.hideEducation();
            }
            // } else if (level == 12) {
            //     if (openedCells == 0) {
            //         this.doShowEducation("Имейте ввиду: ~ромашки~ могут быть крупнее, чем Вы ожидаете!", "sveta1",
            //             [], CoverMode.showMessageAtCenter, 200, null, [], true);
            //         this.screen.setOnClickAnimation("hideEducation")
            //     }
        } else if (level == 14) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                UserService.getUser().addMarker("catFound")
                this.doShowDialogOnSpecificItem(cellState);
            })
        } else if (level == 15) {

            if (openedCells == 0) {
                this.doShowEducation("Кувшинки встречаются только    в ~воде~. Отыщите их!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["lilly", "-hexWater|0.4666", "drop|0.7", "duck"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 18) {

            if (openedCells == 0) {
                this.doShowEducation("Соберите все цели на экране, и он ~прокрутится вниз~.", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 19) {

            if (openedCells == 0) {
                this.doShowEducation("Вскройте соседние с кустом клетки, чтобы собрать ~чернику~", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["bushberry"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 22) {

            if (openedCells == 0) {
                this.doShowEducation("Лаванду можно найти лишь в ~гористой местности~", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["lavanda", "-hexMountain|0.4666", "mount|0.7", "sheep"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 24) {

            if (openedCells == 0) {
                this.doShowEducation("Освободите ячейки от зарослей, чтобы получить ~шиповник~", "sveta1",
                    this.cells, CoverMode.noneVisible, 200, null);
            } else if (openedCells >= 1 && this.educationCover && this.educationCover.alpha == 0.5) {
                this.screen.setOnClickAnimation("hideEducation")
                this.educationCover.alpha = 0.4999;
            }
        } else if (level == 59) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                UserService.getUser().addMarker("owl1found")
                this.doShowDialogOnSpecificItem(cellState);
            })
        } else if (level == 64) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                UserService.getUser().addMarker("owl2found")
                this.doShowDialogOnSpecificItem(cellState);
            })
        } else if (level == 71) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 78) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 121) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 122) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 123) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 143) {
            this.showSpecificCellOnItemAimsLeft(cellState, 0, () => {
                this.doHighlightSpecificItem(cellState);
            })
        } else if (level == 35) {
            if (openedCells == 0) {
                this.doShowEducation("Лопайте желе-грибы, вскрывая соседние клетки. Иначе они ~размножатся~!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 38) {
            if (openedCells == 0) {
                this.doShowEducation("Лопните желудь,         и из него вырастет ~новая клетка~!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["acorn", "acorn2", "-hex|0.4666", "leaf4|0.7"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 41) {
            if (openedCells == 0) {
                this.doShowEducation("Сигнальная ракета ~расчистит линию~, если нажать на неё.", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["rocket2", "rocket1", "rocket3"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 57) {
            if (openedCells == 0) {
                this.doShowEducation("Трясите ульи,       пока не достанете       ~весь мёд~!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["honey|1.3", "hive", "honey|1.3"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 61) {
            if (openedCells == 0) {
                this.doShowEducation("Стрекоза будет ~ускользать~, пока рядом есть кусты. Загоните её в угол!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 83) {
            if (openedCells == 0) {
                // this.doShowEducation("Нажмите на магический шар и ~узрите сокрытое~!", "sveta1",
                //     [], CoverMode.showMessageAtCenter, 200, null, [], true);
                // this.screen.setOnClickAnimation("hideEducation")

                let compassCell = this.cells.filter(c => c.type == CellType.VISION)[0];
                this.doShowEducation("Нажмите на магический шар и ~узрите сокрытое~!", "sveta1", [compassCell],
                    CoverMode.noneVisible, 200, null);

                this.arrow = SpriteUtils.createSprite(this.game, compassCell.state.sprite.x,
                    compassCell.state.sprite.y - compassCell.state.sprite.height / 2 + 25, "arrow");
                this.game.add.existing(this.arrow);
                this.arrow.anchor.set(0.5, 1);
                this.arrow.scale.set(1, 1);
                AnimationUtils.jump(this.game, this.arrow, 0)
                AnimationUtils.fadeIn(this.game, this.arrow, 900)

                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 85) {
            if (openedCells == 0) {
                this.doShowEducation("~Заборчики~ мешают убрать заросли          с соседней клетки.      Но мы найдем путь!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 93) {
            if (openedCells == 0) {
                this.doShowEducation("~Раковину-жемчужницу~ можно найти в песке или в воде.", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["-hexSand|0.4666", "sandPyramid|0.7", "-shell2", "pearl|0.7", "-hexWater|0.4666", "drop|0.7"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 97) {
            if (openedCells == 0) {
                this.doShowEducation("Хотите поймать ~кораблик~?               Загоните его в угол!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 116) {
            if (openedCells == 0) {
                this.doShowEducation("Говорят, в этих песках часто попадается ~янтарь~!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, [], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 134) {
            if (openedCells == 0) {
                this.doShowEducation("Если вам нужны ягоды, поищите их на ~ягодной полянке~!", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["strawberry", "-hexFlower|0.4666", "pinkFlower|0.7", "blackberry"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        } else if (level == 140) {
            if (openedCells == 0) {
                this.doShowEducation("Споры ~радужного цветка~ вскрывают случайные клетки.", "sveta1",
                    [], CoverMode.showMessageAtCenter, 200, null, ["moonflowerClosed1|0.7", "moonflower", "p8|1.5|20"], true);
                this.screen.setOnClickAnimation("hideEducation")
            }
        }


    }
    private doShowDialogOnSpecificItem(cellState: CellState) {
        cellState.content = ContentType.specificItem;
        let openedCell = this.cells.filter(cell => cell.state == cellState).shift();
        this.doShowEducation(null, null, [openedCell], CoverMode.noneVisible, 200, null);

        this.screen.stopLevelForDialog();
        this.screen.lockScreenFor(1000);
        this.screen.dialogPanel.updateReplica(true);
    }

    private doHighlightSpecificItem(cellState: CellState) {
        cellState.content = ContentType.specificItem;
        this.doShowEducation(null, null, [], CoverMode.noneVisible, 200, null);
        this.screen.stopLevelForDialog();

        ComplexAnimationUtils.doHighlightSpecificItem(this.game, this.screen, cellState.sprite, true);

        // //Похоже, к координатам спрайта добавляется координаты камеры, поэтому вычитаем их
        // let flash = SpriteUtils.createSprite(this.game, cellState.sprite.x, cellState.sprite.y-this.game.camera.y, "flash")
        // flash.anchor.set(0.5);flash.alpha = 0;
        // this.addChild(flash);
        // this.game.add.tween(flash.scale).to({x:4.2, y:4.2}, 1000, Easing.Quadratic.InOut, true, 500);
        // // this.game.add.tween(flash).to({x: this.game.width/2, y:this.game.height/2+this.game.camera.y}, 1000, Easing.Quadratic.InOut, true, 500);
        // this.game.add.tween(flash).to({x: this.game.width/2, y:this.game.height/2}, 1000, Easing.Quadratic.InOut, true, 500);
        // this.game.add.tween(flash).to({alpha: 0.8}, 1000, Easing.Quadratic.InOut, true, 500);
        // this.game.add.tween(flash).to({angle:360}, 6000, Easing.Linear.None, true, 500, -1);

        // cellState.sprite.bringToTop();
        // this.game.add.tween(cellState.sprite.scale).to({x:2.5, y:2.5}, 1000, Easing.Quadratic.InOut, true, 500);
        // // this.game.add.tween(cellState.sprite).to({x: this.game.width/2, y:this.game.height/2+this.game.camera.y}, 1000, Easing.Quadratic.InOut, true, 500);
        // this.game.add.tween(cellState.sprite).to({x: this.game.width/2, y:this.game.height/2+this.game.camera.y}, 1000, Easing.Quadratic.InOut, true, 500);
        // this.game.time.events.add(1500, ()=>{
        //     AnimationUtils.floating3(this.game,cellState.sprite, 1)
        // })

        // this.game.time.events.add(2500, ()=>{
        //     this.game.tweens.removeFrom(flash)
        //     this.game.tweens.removeFrom(cellState.sprite)

        //     this.game.add.tween(flash).to({alpha: 0}, 700, Easing.Quadratic.InOut, true, 0);
        //     this.game.add.tween(flash.scale).to({x:1, y:1}, 700, Easing.Quadratic.InOut, true, 0);
        //     this.game.add.tween(flash).to({x: this.screen.topPanel.aims[0].sprite.x, y:this.screen.topPanel.aims[0].sprite.y+this.game.camera.y},
        //          1000, Easing.Quadratic.InOut, true, 0);

        //     this.game.add.tween(cellState.sprite).to({alpha: 0}, 100, Easing.Exponential.In, true, 600);
        //     this.game.add.tween(cellState.sprite.scale).to({x:1, y:1}, 700, Easing.Quadratic.InOut, true, 0);
        //     this.game.add.tween(cellState.sprite).to({x: this.screen.topPanel.aims[0].sprite.x, 
        //         y:this.screen.topPanel.aims[0].sprite.y+this.screen.topPanel.y+this.game.camera.y},
        //          1000, Easing.Quadratic.InOut, true, 0);

        //     this.screen.playAnimation("hideEducation")

        //     this.game.time.events.add(700, () => {
        //         this.screen.playAnimation("winLevel")
        //     })
        // })
    }

    public hideEducation(delay?: number) {
        if (this.arrow) {
            this.game.tweens.removeFrom(this.arrow);
            AnimationUtils.disappear(this.game, this.arrow, delay || 0);
        }
        if (this.educationCover) {
            this.educationCover.hide(delay || 0);
        }
        if (this.helperPanel) {
            this.helperPanel.hide(delay || 0);
        }

        this.game.time.events.add(200, ()=>{
            this.shownWithOkButton = false;
            this.shown = false;
        })
    }

    private doShowEducation(text: string, person: string, cellsToTop: ForestCell[],
        mode: CoverMode, delay: number, centerCell: ForestCell, images?: string[], okButton?: boolean) {
        this.bringToTop();
        console.log("CELLS TO TOP: " + cellsToTop.length)

        switch (mode) {
            case CoverMode.aimVisible:
                this.educationCover = new EducationCover(this.game, this.game.width / 2, 57, 160, 60);
                this.addSprite(this.educationCover);
                this.educationCover.show(delay);
                break;
            case CoverMode.allVisible:
                //do nothing
                break;
            case CoverMode.showMessageAtCenter:
            case CoverMode.showMessageAtCenterPlus200:
            case CoverMode.noneVisible:
                this.educationCover = new EducationCover(this.game, 0, 0, 0, 0);
                this.addSprite(this.educationCover);
                this.educationCover.show(delay);
                break;
        }

        this.centerCell = centerCell;

        cellsToTop.forEach(cell => {
            cell.orderAndBringToTop();
        });

        if (text && text != "") {
            let helperPanelY = 120 + (this.fieldStartY - 120) / 2;

            if (mode == CoverMode.showMessageAtCenter) {
                helperPanelY = this.game.height / 2;
            } else if (mode == CoverMode.showMessageAtCenterPlus200) {
                helperPanelY = this.game.height / 2 + 200;
            }

            this.helperPanel = new HelperPanel(this.game, this.game.width / 2, helperPanelY, text, person, images,
                mode == CoverMode.showMessageAtCenter || mode == CoverMode.showMessageAtCenterPlus200, okButton);
            this.helperPanel.anchor = new Phaser.Point(0.5, 0.5);
            this.addSprite(this.helperPanel);
            this.helperPanel.show(delay);

            if (this.screen.aimsPanel != null) {
                this.screen.aimsPanel.bringToTop();
            }
        } else {
            this.helperPanel = null;
        }

        this.screen.lockScreenFor(700);
        if(okButton) {this.shownWithOkButton = true;}
        this.shown = true;
    }

    private showSpecificCellOnItemAimsLeft(cellState: CellState, /* specificItemId: string,*/ onAimsLeft: number,
        onItemShow?: () => void) {

        let specificItem = SpecialItemsConfiguration.allItems.filter(i => !i.usual && i.level == this.screen.getForestType().id).shift();

        let count: number = this.aims.filter(a => ContentType[a.image] != ContentType.lilly && (a.type == AimType.item || a.type == AimType.itemsBunch)).
            map(a => a.countLeft).reduce((a, b) => a + b, 0)
        // map(a => a.count).shift();

        if (specificItem && count == onAimsLeft + 1 && cellState != null && cellState.content in ItemContents) {
            SpriteUtils.loadTexture(cellState.sprite, specificItem.image);
            if (onItemShow) onItemShow();
        }
    }

    // private showSpecificCellOnItemAimsLeft1(cellState: CellState, /* specificItemId: string,*/ onAimsLeft: number,
    //     onItemShow: () => void) {

    //     if (this.aims[0].type == AimType.itemsBunch) {
    //         onAimsLeft--;
    //     }

    //     if (cellState != null && cellState.content in ItemContents) {
    //         let notOpenedAims = this.cells.filter(cell => (cell.state.content in ItemContents && !cell.state.opened
    //             && (cell.state.content != ItemContents.specificItem || this.aims[0].type == AimType.itemsBunch)));

    //         let notOpenedAdditional = this.screen.cellsProvider.additionalCellTypes.filter(additionalCell => (additionalCell.type in ItemContents 
    //              && (additionalCell.type != ItemContents.specificItem || this.aims[0].type == AimType.itemsBunch)));

    //         let itemAimCountLeft = notOpenedAims.length + notOpenedAdditional.length;
    //         let cellWithSpecificContent = this.cells.filter(cell => cell.state.content == ContentType.specificItem).shift();
    //         let cellWithUsualContent = notOpenedAims.filter(i => i != cellWithSpecificContent).shift();

    //         if (!cellWithSpecificContent) {
    //             // console.error("EducationPanel: ERROR! Cell with specific content not found ")// + specificItemId )
    //         } else if (cellWithUsualContent && cellState == cellWithSpecificContent.state && itemAimCountLeft != onAimsLeft + 1 && notOpenedAims.length + notOpenedAdditional.length > 0) {
    //             // console.log("EDUCATION: 1 case, " + cellState.content + ", itemAimCountLeft: " + itemAimCountLeft + ", cellWithSpecificContent.state.opened = " + cellWithSpecificContent.state.opened + ", isItem: " + (cellState.content in ItemContents))
    //             this.forceOpenCell(cellState, cellWithUsualContent.state.content);
    //         } else if (!cellWithUsualContent || (cellState.content in ItemContents && itemAimCountLeft == onAimsLeft && !cellWithSpecificContent.state.opened)
    //             || (cellState == cellWithSpecificContent.state && (itemAimCountLeft == onAimsLeft + 1 || itemAimCountLeft == onAimsLeft))) {

    //             // console.log("EDUCATION: 2 case, " + cellState.content + ", itemAimCountLeft: " + itemAimCountLeft + ", cellWithSpecificContent.state.opened = " + cellWithSpecificContent.state.opened + ", isItem: " + (cellState.content in ItemContents))
    //             if (cellState != cellWithSpecificContent.state) {
    //                 // console.log("EDUCATION: 1b case, "  + cellState.content + ", itemAimCountLeft: " + itemAimCountLeft + ", cellWithSpecificContent.state.opened = " + cellWithSpecificContent.state.opened + ", isItem: " + (aimIds.indexOf(cellState.content)!= -1))
    //                 this.forceOpenCell(cellState, ContentType.specificItem);
    //             }
    //             onItemShow();
    //         } else {
    //             // console.log("EDUCATION: 3 case, "  + cellState.content + ", itemAimCountLeft: " + itemAimCountLeft + ", cellWithSpecificContent.state.opened = " + cellWithSpecificContent.state.opened + ", isItem: " + (cellState.content in ItemContents))
    //         }
    //     }
    // }

    private forceOpenCell(openedCellState: CellState, cellToOpenType: ContentType): void {
        let openedCell = this.cells.filter(cell => cell.state == openedCellState).shift();
        let cellWithMushroom = this.cells.filter(cell => cell.state.content == cellToOpenType && !cell.state.opened).shift();

        this.switchContent(openedCell, cellWithMushroom);
        (<ForestScreen>(this.screen)).refreshLabels();
    }

    private forceOpenTree(openedCellState: CellState): void {
        let openedCell = this.cells.filter(cell => cell.state == openedCellState).shift();
        let cellWithTree = this.cells.filter(cell => cell.state.content == ContentType.tree).shift();
        if (cellWithTree == null) {
            cellWithTree = this.cells.filter(cell => cell.state.content == ContentType.stump).shift();
        }

        this.switchContent(openedCell, cellWithTree);

        let openedAdjucentCells = this.cells.filter(cell => this.screen.cellsProvider.areAdjucent(cell, openedCell) && !cell.state.opened);
        let withMushrooms = openedAdjucentCells.filter(cell => cell.state.content == ContentType.mushroom).length;

        console.log("withMushrooms!: " + withMushrooms)
        console.log("treeAdjucentCells.length: " + openedAdjucentCells.length)

        //подкладываем грибы рядом с деревом
        while (withMushrooms == 0 || (withMushrooms < 3 && withMushrooms < openedAdjucentCells.length)) {
            let adjucentCellWithoutMushroom = openedAdjucentCells.filter(cell => cell.state.content != ContentType.mushroom).shift();
            let notAdjucentcellWithMushroom = this.cells.filter(cell => cell.state.content == ContentType.mushroom && openedAdjucentCells.indexOf(cell) == -1 && !cell.state.opened).shift();
            this.switchContent(adjucentCellWithoutMushroom, notAdjucentcellWithMushroom);

            withMushrooms = openedAdjucentCells.filter(cell => cell.state.content == ContentType.mushroom && !cell.state.opened).length;

            console.log("withMushrooms!: " + withMushrooms)
            console.log("treeAdjucentCells.length: " + openedAdjucentCells.length)
        }

        (<ForestScreen>(this.screen)).refreshLabels();
    }

    private switchContent(cell: ForestCell, secondCell: ForestCell) {
        cell.state.sprite.visible = false;
        secondCell.state.sprite.visible = false;
        cell.state.sprite.autoCull = true;
        secondCell.state.sprite.autoCull = true;
        let x = cell.state.sprite.x;
        let y = cell.state.sprite.y;
        let content = cell.state.content;
        let sprite = cell.state.sprite;
        let label = cell.state.label;
        // let visibility = cell.state.sprite.visible;

        cell.state.sprite.x = secondCell.state.sprite.x;
        cell.state.sprite.y = secondCell.state.sprite.y;
        cell.state.label.x = secondCell.state.label.x;
        cell.state.label.y = secondCell.state.label.y;
        cell.state.content = secondCell.state.content;
        cell.state.sprite = secondCell.state.sprite;
        cell.state.label = secondCell.state.label;
        // cell.state.sprite.visible = secondCell.state.sprite.visible;
        cell.state.sprite.updateTransform();
        

        secondCell.state.sprite.x = x;
        secondCell.state.sprite.y = y;
        secondCell.state.label.x = x;
        secondCell.state.label.y = y;
        secondCell.state.content = content;
        secondCell.state.sprite = sprite;
        secondCell.state.label = label;
        // secondCell.state.sprite.visible = visibility;
        secondCell.state.sprite.updateTransform();

        this.game.time.events.add(1, ()=>{
            cell.state.sprite.visible = true;
            secondCell.state.sprite.visible = true;
        })

        cell.orderAndBringToTop();
        secondCell.orderAndBringToTop();
    }
}
enum CoverMode {
    aimVisible, allVisible, noneVisible, showMessageAtCenter, showMessageAtCenterPlus200
}