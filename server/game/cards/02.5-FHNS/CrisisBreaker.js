const DrawCard = require('../../drawcard.js');

class CrisisBreaker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready and bring into play',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military' &&
                        ((this.game.currentConflict.attackingPlayer === this.controller && this.game.currentConflict.compareMilitary() < 0) ||
                        (this.game.currentConflict.defendingPlayer === this.controller && this.game.currentConflict.compareMilitary() > 0)),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.hasTrait('berserker') && (!card.isParticipating() || card.bowed)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2} and move it into the conflict', this.controller, this, context.target);
                this.controller.readyCard(context.target, this);
                this.game.currentConflict.moveToConflict(context.target);
            }
        });
    }
}

CrisisBreaker.id = 'crisis-breaker';

module.exports = CrisisBreaker;
