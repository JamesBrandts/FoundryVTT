await Dialog.prompt({
    content: `
      <div class="form-group">
          <label for="minions">How many minions?</label>
          <input type="number" name="minions" value="4">
      </div>
      <div class="form-group">
          <label for="baseBonus">Attack Bonus Base</label>
          <input type="number" name="baseBonus" value="3">
      </div>
      <div class="form-group">
          <label for="baseDamage">Damage per minion</label>
          <input type="number" name="baseDamage" value="2">
      </div>`,
    callback: (html) => {
        let minions = html.find('[name="minions"]').val();
        let baseBonus = html.find('[name="baseBonus"]').val();
        let baseDamage = html.find('[name="baseDamage"]').val();
        attackRoll = new Roll(`d20+${baseBonus}+${minions-1}`).evaluate({async:false});
        attackRoll.toMessage({flavor:"Minions Attack Roll"})
        let target = Array.from(game.user.targets)[0];
        let ac = target.actor.data.data.attributes.ac.value;
        if(attackRoll.total>=ac){
            damageRoll = new Roll(`${baseDamage*minions}`).evaluate({async:false});
            token = canvas.tokens.controlled[0]
            new MidiQOL.DamageOnlyWorkflow(token.actor, token, damageRoll.total, "slashing", [target], damageRoll, { flavor: 'Mob attack Damage'});
        }
    }
})
