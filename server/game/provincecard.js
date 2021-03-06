const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.isProvince = true;
        this.isBroken = false;
        this.menu = _([{ command: 'break', text: 'Break/unbreak this province' }, { command: 'hide', text: 'Flip face down' }]);
    }

    getStrength() {
        return this.cardData.strength + this.strengthModifier + this.getDynastyOrStrongholdCardModifier();
    }

    getDynastyOrStrongholdCardModifier() {
        let province = this.controller.getSourceList(this.location);
        return province.reduce((bonus, card) => {
            if(card !== this) {
                return bonus + card.getProvinceStrengthBonus();
            }
            return bonus; 
        }, 0);
    }

    getElement() {
        return this.cardData.element;
    }

    getBaseStrength() {
        return this.cardData.strength;  
    }

    modifyProvinceStrength(amount, applying = true) {
        this.strengthModifier += amount;
        this.game.raiseEvent('onProvinceStrengthChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    flipFaceup() {
        this.facedown = false;
    }

    breakProvince() {
        this.isBroken = true;
    }

    canTriggerAbilities() {
        if(!this.location.includes('province') || this.facedown) {
            return false;
        }
        return super.canTriggerAbilities();
    }

    cannotBeStrongholdProvince() {
        return false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            strength: this.getStrength(),
            isBroken: this.isBroken
        });
    }

}

module.exports = ProvinceCard;
