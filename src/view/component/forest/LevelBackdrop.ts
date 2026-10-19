import ForestType from '../../../core/model/forest/ForestType';
import SpriteUtils from '../../../core/utils/SpriteUtils';

/** One continuous painting, with a separate, smoothly graded readability wash. */
export default class LevelBackdrop {
    public static readonly WATER_COVER_PATH = 'assets/arcane/levels/water-cover-v1.png';
    private static readonly HEADERS: {[key: string]: string} = {
        forestHeader1: 'forest', mountinesHeader: 'mountains', forestHeader2: 'dark',
        lakeHeader: 'lake', flowersFieldHeader: 'flowers', junglesHeader: 'jungle',
        bugForestHeader: 'bug', snailForestHeader: 'snail', cloverHeader: 'clover', hiveHeader: 'hive'
    };
    private static readonly JOURNEYS: {[key: string]: string} = {
        riverJourneyScene: 'journey-river', mushroomJourneyScene: 'journey-forest',
        dungeonJourneyScene: 'journey-dungeon', balloonJourneyScene: 'journey-balloon'
    };

    public static artwork(forest: ForestType): {key: string; path: string} {
        if (forest.sceneImage && !LevelBackdrop.JOURNEYS[forest.sceneImage]) return {key: forest.sceneImage, path: null};
        const environments = ['forest', 'dark', 'house', 'flowers', 'lake', 'jungle', 'bug', 'snail'];
        const name = LevelBackdrop.JOURNEYS[forest.sceneImage] || LevelBackdrop.HEADERS[forest.header] || environments[forest.environment] || 'forest';
        return {key: 'arcane-level-' + name, path: 'assets/arcane/levels/' + name + '-v1.webp'};
    }

    public static preload(game: Phaser.Game, forest: ForestType): void {
        const art = LevelBackdrop.artwork(forest);
        if (art.path && !game.cache.checkImageKey(art.key)) game.load.image(art.key, art.path);
        // A standalone key keeps this new cover independent of the old water atlas frame.
        if (!game.cache.checkImageKey('hexWater')) game.load.image('hexWater', LevelBackdrop.WATER_COVER_PATH);
    }

    public static preloadForEditor(game: Phaser.Game): void {
        const names = Object.keys(LevelBackdrop.HEADERS).map(key => LevelBackdrop.HEADERS[key])
            .concat(['house'], Object.keys(LevelBackdrop.JOURNEYS).map(key => LevelBackdrop.JOURNEYS[key]));
        names.forEach(name => {
            if (!game.cache.checkImageKey('arcane-level-' + name)) game.load.image('arcane-level-' + name, 'assets/arcane/levels/' + name + '-v1.webp');
        });
        if (!game.cache.checkImageKey('hexWater')) game.load.image('hexWater', LevelBackdrop.WATER_COVER_PATH);
    }

    public static create(game: Phaser.Game, forest: ForestType, headerHeight: number, forEditor: boolean = false): Phaser.Sprite {
        const art = LevelBackdrop.artwork(forest);
        const source = SpriteUtils.createSprite(game, 0, 0, art.key);
        const crop = source.texture.crop;
        const height = Math.ceil(Math.max(game.height + 320, game.width * 3));
        const bitmap = game.make.bitmapData(game.width, height);
        const scale = Math.max(game.width / crop.width, height / crop.height);
        const width = crop.width * scale, paintedHeight = crop.height * scale;
        bitmap.context.drawImage(source.texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height,
            (game.width - width) / 2, 0, width, paintedHeight);
        source.destroy();

        const mist = bitmap.context.createLinearGradient(0, headerHeight + 24, 0, headerHeight + 510);
        mist.addColorStop(0, 'rgba(255,255,255,0)');
        mist.addColorStop(0.22, 'rgba(255,255,255,0.12)');
        mist.addColorStop(0.62, 'rgba(255,255,255,0.60)');
        mist.addColorStop(1, 'rgba(255,255,255,0.78)');
        bitmap.context.fillStyle = mist;bitmap.context.fillRect(0, headerHeight + 24, game.width, height);
        bitmap.dirty = true;
        const scene = new Phaser.Sprite(game, 0, 0, bitmap);
        scene.name = 'levelBackdrop';scene.inputEnabled = true;scene.fixedToCamera = !forEditor;
        // Follow the field through the spare artwork, then stop before its bottom edge.
        scene.update = () => {if (!forEditor) scene.cameraOffset.y = -LevelBackdrop.scrollOffset(game, height);};
        const scenePostUpdate = scene.postUpdate;
        scene.postUpdate = () => {scene.update();scenePostUpdate.call(scene);};
        scene.events.onDestroy.addOnce(() => bitmap.destroy());
        return scene;
    }

    private static scrollOffset(game: Phaser.Game, height: number): number {
        return Math.min(Math.max(0, game.camera ? game.camera.y : 0), Math.max(0, height - game.height - 160));
    }

    /** Bottom scroll masks sample the same painting, so their edges cannot reveal a tiled ground. */
    public static slice(game: Phaser.Game, scene: Phaser.Sprite, top: number, height: number, feather: boolean): Phaser.Sprite {
        const bitmap = game.make.bitmapData(game.width, height);
        let fade: CanvasGradient;
        if (feather) {
            fade = bitmap.context.createLinearGradient(0, 0, 0, height);
            fade.addColorStop(0, 'rgba(255,255,255,0)');fade.addColorStop(1, 'rgba(255,255,255,1)');
        }
        const sprite = new Phaser.Sprite(game, 0, top, bitmap);
        sprite.fixedToCamera = true;sprite.inputEnabled = false;
        let lastOffset: number = null;
        sprite.update = () => {
            const offset = LevelBackdrop.scrollOffset(game, scene.height);
            if (lastOffset === offset) return;
            lastOffset = offset;
            bitmap.context.globalCompositeOperation = 'source-over';bitmap.context.clearRect(0, 0, game.width, height);
            bitmap.context.drawImage(scene.texture.baseTexture.source, 0, top + offset, game.width, height, 0, 0, game.width, height);
            if (feather) {
                bitmap.context.globalCompositeOperation = 'destination-in';
                bitmap.context.fillStyle = fade;bitmap.context.fillRect(0, 0, game.width, height);
                bitmap.context.globalCompositeOperation = 'source-over';
            }
            bitmap.dirty = true;
        };
        sprite.update();
        const slicePostUpdate = sprite.postUpdate;
        sprite.postUpdate = () => {sprite.update();slicePostUpdate.call(sprite);};
        sprite.events.onDestroy.addOnce(() => bitmap.destroy());
        return sprite;
    }
}
