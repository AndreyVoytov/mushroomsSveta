import { ShopArtifactSkillConfig, ShopArtifactSkillId } from "../model/shop/ShopArtifactModels";

export default class ShopArtifactSkillsConfiguration {

    public static allSkills: ShopArtifactSkillConfig[] = [
        { id: 'energy', name: 'shop.skill.energy.name', icon: 'shopSkillEnergy', valuePerLevel: 5, effectValue: 5 },
        { id: 'bravery', name: 'shop.skill.bravery.name', icon: 'shopSkillBravery', valuePerLevel: 10, effectValue: 10 },
        { id: 'friendship', name: 'shop.skill.friendship.name', icon: 'shopSkillFriendship', valuePerLevel: 6, effectValue: 6 },
        { id: 'knowledge', name: 'shop.skill.knowledge.name', icon: 'shopSkillKnowledge', valuePerLevel: 8, effectValue: 8 }
    ];

    public static getById(skillId: ShopArtifactSkillId): ShopArtifactSkillConfig {
        return this.allSkills.filter(skill => skill.id == skillId).shift();
    }
}
