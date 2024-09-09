import Preset from "../../view/game/Preset";
import BasePanel from "../../view/component/panel/BasePanel";

export default class Utils {

    public static dist(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    public static getRandomElement<T>(array: T[]): T {
        if (array.length == 0) return null;

        let choosen = this.random(array.length);
        return array[choosen];
    }

    public static getDifferentRandomElements(array: string[], count:number): string[] {
        if (array.length < count) return null;

        let arrayCopy = [...array];
        this.shuffle(arrayCopy);

        return arrayCopy.slice(0, count);
    }

    public static shuffle<T>(array: T[]) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
      
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

    public static random(maxValue: number): number {
        return Math.floor(Math.random() * maxValue);
    }

    public static randomBoolean(): boolean {
        return this.random(2) == 0;
    }

    public static capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public static getTotalWidth(spriteWithChildren: Phaser.Sprite) {
        return PIXI.DisplayObjectContainer.prototype.getBounds.call(spriteWithChildren).width;
    }

    public static replaceAt(str: string, index: number, replacement: string): string {
        if (index > str.length - 1 || index < 0) {
            return str;
        }
        let res = str.substr(0, index) + replacement + (index == str.length - 1 ? "" : str.substr(index + replacement.length));
        return res;

    }

    public static getRemain(date: Date): string {
        let remainSeconds = Math.floor((date.getTime() - Date.now()) / 1000);

        if (remainSeconds < 0) {
            remainSeconds = 0;
        }

        let res = "";

        if (remainSeconds > 3600) {
            res += Math.floor(remainSeconds / 3600) + "ч. "
            remainSeconds = remainSeconds % 3600;
        }

        if (remainSeconds > 60) {
            res += Math.floor(remainSeconds / 60) + "м. "
            remainSeconds = remainSeconds % 60;
        }

        res += Math.floor(remainSeconds) + "c.";

        return res;
    }

    public static delete<T>(array: T[], element: T): void {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    public static getNext<T>(array: T[], element: T): T {
        let index = array.indexOf(element);

        if (index == array.length - 1 || index == -1) {
            return array[0];
        } else {
            return array[index + 1];
        }
    }

    public static getPrevious<T>(array: T[], element: T): T {
        let index = array.indexOf(element);

        if (index == 0 || index == -1) {
            return array[array.length - 1];
        } else {
            return array[index - 1];
        }
    }

    public static chooseRussianWord(count: number, forOne: string, forTwo: string, forFive: string): string {
        if ((count % 100 >= 10 && count % 100 <= 20) || count % 10 > 4 || count % 10 == 0) {
            return forFive;
        } else if ((count % 10) == 1) {
            return forOne;
        } else {
            return forTwo;
        }

    }

    public static range(start: number, end: number): number[] {
        let res = [];
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }

    public static sign(x) {
        if (x == 0) return 0;
        return x / Math.abs(x);
    }

    public static UUID() {
        return ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, c =>
            (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
           );
    }

    public static applyPreset(sprite: Phaser.Sprite | Phaser.TileSprite | Phaser.Button | Phaser.Group, preset: Preset): void {
        let fixedToTheCamera = sprite.fixedToCamera;
        sprite.fixedToCamera = false;

        sprite.x = preset.x;
        sprite.y = preset.y;
        sprite.scale.x = preset.scaleX;
        sprite.scale.y = preset.scaleY;
        if(!(sprite instanceof Phaser.Group)){
            sprite.anchor.x = preset.anchorX;
            sprite.anchor.y = preset.anchorY;
        }
        sprite.rotation = preset.rotation;
        if (sprite instanceof Phaser.Text) {
            sprite.fontSize = sprite.fontSize;
        }

        sprite.fixedToCamera = fixedToTheCamera;
    }

    public static applyPresetToArray( sprites: PIXI.DisplayObject[], presets: Preset[]) {
    // protected applyPreset(presets: Preset[], sprites: (Phaser.Sprite | Phaser.TileSprite | Phaser.Button)[]) {
        // presets.forEach(preset => {
        //     if (preset.spriteId != "") {
        //         let children = sprites.filter(s => s.name == preset.spriteId).shift()
        //         if (children && (children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button)) {
        //             console.log("APPLY PRESET from getByName: " + preset.spriteId)
        //             Utils.applyPreset(children, preset);
        //         }
        //     }
        // });

        presets.forEach(preset => {
            sprites.forEach(child => {
                if (preset.spriteId != "" && (child instanceof Phaser.Sprite || child instanceof Phaser.TileSprite || child instanceof Phaser.Button) 
                && child.name == preset.spriteId) {
                    Utils.applyPreset(child, preset);
                }
            });
        });
    }

    public static presetOf(sprite: Phaser.Sprite | Phaser.TileSprite | Phaser.Button): Preset {
        let preset = new Preset();
        preset.spriteId = sprite.name;
        preset.x = sprite.x;
        preset.y = sprite.y;
        preset.scaleX = sprite.scale.x;
        preset.scaleY = sprite.scale.y;
        preset.anchorX = sprite.anchor.x;
        preset.anchorY = sprite.anchor.y;
        preset.rotation = sprite.rotation;
        if (sprite instanceof Phaser.Text) {
            preset.fontSize = this.incrementFontSize(sprite.fontSize, 0);
        }
        return preset;
    }


    public static presetOfPanel(panel:BasePanel):Preset[] {
        // console.log("PRESET for " + panel.name + ":");

        let presets = [];
        panel.children.forEach(children => {
            if ((children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button) && children.name) {
                presets.push(Utils.presetOf(children));
            }
        })

        return presets;
    }
        

    public static incrementFontSize(fontSize: string | number, addition: number): number {
        return Number(fontSize.toString().replace("x", "").replace("p", "")) + addition;
    }


    public static enumValues(enumType: object) {
        return Utils.enumToKeyValueArray(enumType)
            .map((kv) => kv.value);
    }

    public static enumToKeyValueArray(enumType: object) {
        return Utils.enumKeys(enumType)
            .map((key) => {
                return { key, value: enumType[key] };
            });
    }

    public static enumKeys(enumType: object) {
        const members = Object.keys(enumType);
        return members.filter((x) => Number.isNaN(parseInt(x, 10)))
    }

    public static getEnumKeyByEnumValue(myEnum, enumValue) {
        let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }
    


    public static alphanumCompare(a: string, b: string): number {
        if (a[0] == Number(a[0]).toString() && b[0] != Number(b[0]).toString()) {
            return -1;
        } else if (a[0] != Number(a[0]).toString() && b[0] == Number(b[0]).toString()) {
            return 1;
        }

        var aa = this.chunkify(a.toLowerCase());
        var bb = this.chunkify(b.toLowerCase());

        for (let x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);
                if (c == aa[x] && d == bb[x]) {
                    return c - d;
                } else return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
        return aa.length - bb.length;
    }
    private static chunkify(t) {
        var tz = new Array();
        var x = 0, y = -1, n = false, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >= 48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }

    public static getUrlParameter(name:string) : string {
        let url = location.href;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }
}