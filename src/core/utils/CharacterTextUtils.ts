import CharactersConfiguration from "../configuration/CharactersConfiguration";
import LocalizationService from "../localization/LocalizationService";
import { CharacterConfig } from "../model/character/CharacterModels";
import User from "../model/user/User";
import UserService from "../service/UserService";

export default class CharacterTextUtils {

    public static getDisplayName(characterId: string, config?: CharacterConfig, user?: User): string {
        const safeConfig = config || CharactersConfiguration.getById(characterId);

        if (characterId == CharactersConfiguration.START_CHARACTER_ID) {
            return LocalizationService.get("ui.character.name.sveta", LocalizationService.isRussian() ? "Эмма" : "Emma");
        }

        if (characterId == CharactersConfiguration.BORIS_CHARACTER_ID) {
            return this.isBorisRevealed(user)
                ? LocalizationService.get("ui.character.name.boris", LocalizationService.isRussian() ? "Борис" : "Boris")
                : LocalizationService.get("ui.character.name.kitten", LocalizationService.isRussian() ? "Котёнок" : "Kitten");
        }

        if (characterId == CharactersConfiguration.OWL_CHARACTER_ID) {
            return LocalizationService.get("ui.character.name.owl", LocalizationService.isRussian() ? "Совёнок" : "Owlet");
        }

        if (characterId == CharactersConfiguration.LESHY_CHARACTER_ID) {
            return LocalizationService.get("ui.character.name.leshy", LocalizationService.isRussian() ? "Леший" : "Leshy");
        }

        return safeConfig ? LocalizationService.get(safeConfig.name, safeConfig.name) : LocalizationService.get("ui.character.title", LocalizationService.isRussian() ? "Персонаж" : "Character");
    }

    public static isBorisRevealed(user?: User): boolean {
        const safeUser = user || UserService.getUser();
        return !!safeUser && safeUser.getCompletedReplicas().indexOf("r27") != -1;
    }
}
