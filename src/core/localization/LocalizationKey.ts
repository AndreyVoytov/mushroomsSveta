import BoosterType from '../model/enum/BoosterType';
import DiaryContentType from '../model/diary/DiaryContentType';
import ReplicaType from '../model/replica/ReplicaType';
import Buy from '../model/shop/Buy';

type ReplicaField = 'personName' | 'text' | 'buttonName';
type DiaryField = 'title' | 'details' | 'titleForProgress';
type BuyField = 'name';
type BoosterField = 'name' | 'desc' | 'question';

export default class LocalizationKey {

    public static ui(id: string): string {
        return 'ui.' + id;
    }

    public static replica(replicaOrId: ReplicaType | string, field: ReplicaField): string {
        const id = typeof replicaOrId === 'string' ? replicaOrId : replicaOrId.id;
        return 'replica.' + id + '.' + field;
    }

    public static diary(entryOrId: DiaryContentType | string, field: DiaryField): string {
        const id = typeof entryOrId === 'string' ? entryOrId : entryOrId.id;
        return 'diary.' + id + '.' + field;
    }

    public static diaryNote(entryOrId: DiaryContentType | string, noteIndex: number): string {
        const id = typeof entryOrId === 'string' ? entryOrId : entryOrId.id;
        return 'diary.' + id + '.note.' + noteIndex;
    }

    public static buy(buyOrId: Buy | string, field: BuyField): string {
        const id = typeof buyOrId === 'string' ? buyOrId : buyOrId.id;
        return 'buy.' + id + '.' + field;
    }

    public static booster(type: BoosterType | string, field: BoosterField): string {
        return 'booster.' + type + '.' + field;
    }
}
