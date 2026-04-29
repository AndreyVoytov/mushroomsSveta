import { ShopArtifactSkillConfig, ShopArtifactSkillId } from "../model/shop/ShopArtifactModels";

export default class ShopArtifactSkillsConfiguration {

    public static allSkills: ShopArtifactSkillConfig[] = [
        { id: 'energy', name: 'shop.skill.energy.name', descriptionText: 'shop.skill.energy.description', icon: 'shopSkillEnergy', valuePerLevel: 5, effectValue: 5, upgradePriceFormula: { basePrice: 12, stepPrice: 4 } },
        { id: 'bravery', name: 'shop.skill.bravery.name', descriptionText: 'shop.skill.bravery.description', icon: 'shopSkillBravery', valuePerLevel: 10, effectValue: 10, upgradePriceFormula: { basePrice: 15, stepPrice: 5 } },
        { id: 'friendship', name: 'shop.skill.friendship.name', descriptionText: 'shop.skill.friendship.description', icon: 'shopSkillFriendship', valuePerLevel: 6, effectValue: 6, upgradePriceFormula: { basePrice: 13, stepPrice: 4 } },
        { id: 'knowledge', name: 'shop.skill.knowledge.name', descriptionText: 'shop.skill.knowledge.description', icon: 'shopSkillKnowledge', valuePerLevel: 8, effectValue: 8, upgradePriceFormula: { basePrice: 16, stepPrice: 5 } }
    ];

    public static getById(skillId: ShopArtifactSkillId): ShopArtifactSkillConfig {
        return this.allSkills.filter(skill => skill.id == skillId).shift();
    }

    public static getUpgradePrice(skillId: ShopArtifactSkillId, currentValue: number): number {
        const skill = this.getById(skillId);
        if (!skill) {
            return 0;
        }

        return skill.upgradePriceFormula.basePrice + Math.max(0, currentValue - 1) * skill.upgradePriceFormula.stepPrice;
    }
}
