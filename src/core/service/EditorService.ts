/// <reference path="../model/forest/ForestType.ts" />
import Environment from '../model/enum/Environment';
import ForestType from './../model/forest/ForestType';
import EditorScreen from './../../view/screen/EditorScreen';
import Game from '../../view/game/Game';
import ForestDao from '../dao/ForestDao';
import ReplicaDao from '../dao/ReplicaDao';
import EditReplicaScreen from '../../view/screen/EditReplicaScreen';
import ReplicaType from '../model/replica/ReplicaType';
export default class EditorService {

    private static LS_EDITOR_LEVEL_ID = "editorLevelName";
    private static LS_EDITOR_REPLICA_ID = "editorreplicaName";

    //*************** Editor dialogs **********************

    public static showLevelEditorDialog(game: Phaser.Game) {
        let levelName = localStorage.getItem(EditorService.LS_EDITOR_LEVEL_ID);

        let forestIds = ForestDao.getEntity().getAll().filter(f => f?true: false).map(f => f.id);
        this.showDialog(game, "Создать/открыть", "Введите id уровня", "Создать/открыть", "уровень", "уровни", forestIds, levelName || "", true,  () => {
            let value = (<HTMLInputElement>document.getElementById("input")).value;
            if (value) {
                EditorService.switchToLevel(game, value);
                EditorService.hideDialog();
            } else {
                alert("Введите имя уровня!");
            }
        }, (game:Phaser.Game, id:string)=>{
            EditorService.switchToLevel(game, id);
        },  (id:string)=>{
            ForestDao.getEntity().delete(id);
            EditorService.hideDialog();
            EditorService.showLevelEditorDialog(game);
        },  (id:string)=>{
            EditorService.showTextField("Переименовать уровень", id, (value:string) => {
                if (id) {
                    EditorService.renameLevel(game, id, value, false);
                    EditorService.hideDialog();
                    EditorService.showLevelEditorDialog(game);
                } else {
                    alert("Имя уровня не может быть пустым!");
                }
            } )
        }, ()=>{
            ForestDao.getEntity().reset();
        }, (file:string)=>{
            ForestDao.getEntity().import(file);
        }, (game:Phaser.Game) => {
            EditorService.showLevelEditorDialog(game);
        });
    }

    public static showReplicaEditorDialog(game: Phaser.Game) {
        let replicaName = localStorage.getItem(EditorService.LS_EDITOR_REPLICA_ID);

        let replicaIds = ReplicaDao.getEntity().getAll().map(r => r.id);
        this.showDialog(game, "Открыть реплику", "Введите id реплики", "Открыть", "реплика", "реплики", replicaIds, replicaName || "", true,  () => {
            let value = (<HTMLInputElement>document.getElementById("input")).value;
            if (value) {
                EditorService.switchToReplica(game, value);
            } else {
                alert("Введите имя реплики!");
            }
        }, (game:Phaser.Game, id:string)=>{
            EditorService.switchToReplica(game, id);
        },  (id:string)=>{
            ReplicaDao.getEntity().delete(id);
            EditorService.hideDialog();
            EditorService.showReplicaEditorDialog(game);
        },  (id:string)=>{
            EditorService.showTextField("Переименовать реплику", id, (value:string) => {
                if (id) {
                    EditorService.renameReplica(game, id, value, false);
                    EditorService.hideDialog();
                    EditorService.showReplicaEditorDialog(game);
                } else {
                    alert("Имя реплики не может быть пустым!");
                }
            } )
        }, ()=>{
            ReplicaDao.getEntity().reset();
        }, (file:string)=>{
            ReplicaDao.getEntity().import(file);
        }, (game:Phaser.Game) => {
            EditorService.showReplicaEditorDialog(game);
        });
    }


    // ******************* html ui **************************

    private static showDialog(game: Phaser.Game, header: string, comment: string, buttonName: string, subjectNameAccusative:string, subjectNamePlural:string,
        listValues:string[], inputValue: string, showInput: boolean, mainAction: () => void, selectAction: (game:Phaser.Game, id:string)=>void,
        deleteAction: (id:string) => void, renameAction: (id:string) => void, refreshAction:()=> void, importAction:(file:string)=> void,
        showEditorDialogAction: (game:Phaser.Game)=> void) {

        //form
        document.getElementById("dialog").style.display = "inline-block";
        (<HTMLInputElement>document.getElementById("input")).value = inputValue;
        if (!showInput) {
            (<HTMLInputElement>document.getElementById("input")).style.display = "none";
        }
        document.getElementById("actionButton").innerHTML = buttonName;
        document.getElementById("header").innerHTML = header;
        document.getElementById("message").innerHTML = comment;

        (<HTMLButtonElement>document.getElementById("actionButton")).onclick = mainAction;
        (<HTMLLinkElement>document.getElementById("closeLink")).onclick = () => EditorService.hideDialog();

        //list
        document.getElementById("list").style.display = "inline-block";
        document.getElementById("list").innerHTML = "";

        document.getElementById("import").style.display = "inline-block";

        let innerHtml = "";
        listValues.forEach(fid => {
            innerHtml +=
            '<div class="lem" id="lvl-' + fid + '">' +
            '<div>' + fid + '</div>' +
            '<div class="closeCont" style="top: 0;"><a class="close" id="delete-' + fid + '">X</a></div>' +
            '<div class="closeCont" style="top: 0;right: 33px;"><a class="close" id="open-' + fid + '">&gt;</a></div>' +
            '<div class="closeCont" style="top: 0;background: none;right: 66px;"><a class="close" id="rename-' + fid + '"><img src="assets/ui/editor/renameButton.png" style="width: 30px;"></a></div>' +
            '</div>';
        });
        
        document.getElementById("list").innerHTML = innerHtml;
        listValues.forEach(fid=> {
            (<HTMLLinkElement>document.getElementById("delete-" + fid)).onclick = () => {
                let confirmDelete = window.confirm("Вы действительно хотите удалить "+ subjectNameAccusative + " '" + fid + "'?");
                if (confirmDelete) {
                    deleteAction(fid);
                    document.getElementById("lvl-" + fid).outerHTML = "";
                }
            };

            (<HTMLLinkElement>document.getElementById("open-" + fid)).onclick = () => {
                selectAction(game, fid);
                EditorService.hideDialog();
            };

            (<HTMLLinkElement>document.getElementById("rename-" + fid)).onclick = () => {
                renameAction(fid);
            };
        });

        (<HTMLLinkElement>document.getElementById("refreshLevels")).onclick = () => {
            let confirmDelete = window.confirm("Вы действительно хотите сбросить " + subjectNamePlural + " до стандартного набора?");
            if (confirmDelete) {
                console.log("refresh forests!")
                EditorService.hideDialog();
                refreshAction();
                showEditorDialogAction(game);
            }            
        };

        let fileElement = (<HTMLInputElement>document.getElementById('file'));

        fileElement.onchange = function () {
            let files = fileElement.files;
            var file = files[files.length - 1];
            fileElement.value = null;
            var reader = new FileReader();
            reader.onload = function (progressEvent) {
                try {
                    JSON.parse(<string>this.result);
                } catch (e) {
                    alert("Ошибка! Некорректные " + subjectNamePlural + " в файле!");
                }
                importAction(<string>this.result);
                EditorService.hideDialog();
                showEditorDialogAction(game);
                alert(subjectNamePlural + " загружены!");
            };
            reader.readAsText(file);
        };
    }

    private static hideDialog() {
        document.getElementById("dialog").style.display = "none";
        document.getElementById("list").style.display = "none";
        document.getElementById("import").style.display = "none";
    }

    public static showTextField(header: string, value:string, action: (value:string) => void){
        document.getElementById("textAreaСont").style.display = "inline-block";

        let textArea = <HTMLTextAreaElement>document.getElementById("textArea")
        textArea.value = value;

        document.getElementById("textAreaHeader").innerText = header;

        document.getElementById("textArea").focus();

        (<HTMLLinkElement>document.getElementById("saveText")).onclick = () => {
            action(textArea.value);
            document.getElementById("textAreaСont").style.display = "none";
        };
    }

    public static showSimpleList(header: string, values:string[], action: (id:string) => void) {
        //list
        document.getElementById("simpleListCont").style.display = "inline-block";
        document.getElementById("simpleList").innerHTML = "";

        let innerHtml = '<div class="lem" style="padding-left:0px;background: #924f15;margin: -10px -12px 0px;color: wheat;position: fixed;width: 323px;z-index: 100;"><b>'+ header +'</b><a></a></div><br/>';
        values.forEach(v => {
            if (v) {
                innerHtml +=
                    '<div class="lem" style="padding-left:0px">' +
                    '<a style="display:block" id="choose-' + v + '">' + v + '<a/>' +
                    '</div>';
            }
        });
        document.getElementById("simpleList").innerHTML = innerHtml;
        values.forEach(v => {
            if (v) {
                (<HTMLLinkElement>document.getElementById("choose-" + v)).onclick = () => {
                    action(v);
                    document.getElementById("simpleListCont").style.display = "none";
                };
            }
        });

    }

    //******************* Editor actions ************************

    public static saveLevel(forestType: ForestType) {
        ForestDao.getEntity().update(forestType);
    }

    public static saveReplica(replica: ReplicaType) {
        ReplicaDao.getEntity().update(replica);
    }

    public static renameLevel(game: Phaser.Game, oldName: string, newName: string, loadLevelOnFinish?: boolean) {
        let existingForest = ForestDao.getEntity().getById(newName);

        if (existingForest) {
            alert("Уровень с id='" + newName + "' уже существует!");
            return;
        }

        let forestToRename = ForestDao.getEntity().getById(oldName);
        forestToRename.id = newName;

        ForestDao.getEntity().delete(oldName);
        ForestDao.getEntity().update(forestToRename);

        localStorage.setItem(EditorService.LS_EDITOR_LEVEL_ID, newName);

        if (loadLevelOnFinish) {
            (<Game>game).startScene(EditorScreen, true, false);
        }
    }

    public static setCurrentReplicaId(id:string){
        localStorage.setItem(EditorService.LS_EDITOR_REPLICA_ID, id);
    }

    public static renameReplica(game: Phaser.Game, oldName: string, newName: string, loadLevelOnFinish?: boolean) {
        let existing = ReplicaDao.getEntity().getById(newName);

        if (existing) {
            alert("Реплика с id='" + newName + "' уже существует!");
            return;
        }

        let toRename = ReplicaDao.getEntity().getById(oldName);
        toRename.id = newName;

        ReplicaDao.getEntity().delete(oldName);
        ReplicaDao.getEntity().update(toRename);

        localStorage.setItem(EditorService.LS_EDITOR_REPLICA_ID, newName);

        if (loadLevelOnFinish) {
            (<Game>game).startScene(EditReplicaScreen, true, false);
        }
    }

    public static switchToLevel(game: Phaser.Game, levelName: string): void {
        document.getElementById("dialog").style.display = "none";
        localStorage.setItem(EditorService.LS_EDITOR_LEVEL_ID, levelName);

        let level = ForestDao.getEntity().getById(levelName);
        if (!level) {
            level = JSON.parse(JSON.stringify(this.editorLevel));
            level.id = levelName;
            ForestDao.getEntity().update(level);
        }
        (<Game>game).startScene(EditorScreen, true, false);
    }

    public static switchToReplica(game: Phaser.Game, replicaName: string): void {
        document.getElementById("dialog").style.display = "none";
        localStorage.setItem(EditorService.LS_EDITOR_REPLICA_ID, replicaName);

        let replica = ReplicaDao.getEntity().getById(replicaName);
        if (!replica) {
           alert('Реплика не обнаружена!')
        } else {
            (<Game>game).startScene(EditReplicaScreen, true, false);
            EditorService.hideDialog();
        }
    }

    //не использовать символы #, & 
    public static downloadLevels(): void {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(ForestDao.getEntity().getAll(), null, "\t"));
        element.setAttribute('download', "levels");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    public static downloadReplicas(): void {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(ReplicaDao.getEntity().getAll(), null, "\t"));
        element.setAttribute('download', "replicas");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }


    public static getCurrentLevel(): ForestType {
        let levelName = localStorage.getItem(EditorService.LS_EDITOR_LEVEL_ID);

        if (levelName) {
            return ForestDao.getEntity().getById(levelName);
        }

        return null;
    }

    public static getCurrentReplica(): ReplicaType {
        let replicaName = localStorage.getItem(EditorService.LS_EDITOR_REPLICA_ID);

        if (replicaName) {
            return ReplicaDao.getEntity().getById(replicaName);
        }

        return ReplicaDao.getEntity().getAll()[0];
    }

    private static editorLevel: ForestType = {
        "id": "default",
        "environment": Environment.forest,
        "mask": "ggggggg" +
            "ggggggg" +
            "ggggggg" +
            "ggggggg" +
            "ggggggg" +
            "ggggggg" +
            "ggggggg" +
            "0000000" +
            "0000000" +
            "0000000" +
            "0000000" +
            "0000000" +
            "0000000" +
            "0000000" +
            "0000000",
        "leafType": "leaf1",
        "items": [
            { "name": "mushroom", "count": 7 }
        ],
        "bonuses": 3,
        "steps": 10,
        "waterCenter": null
    }
}


