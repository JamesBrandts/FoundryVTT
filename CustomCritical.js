Hooks.on("midi-qol.preAttackRoll", async (workflow) =>{
    const attacker = game.actors.get(workflow.actor.id)
    const targetAc = canvas.tokens.get(workflow.targets.ids[0]).actor.data.data.attributes.ac.value
    const attackBonus = workflow.item.labels.toHit
    const calc = targetAc + 10 - eval('0' + attackBonus)
    let newThreshold = 20
    if (calc<20){newThreshold = calc}
    await attacker.setFlag('dnd5e','weaponCriticalThreshold',newThreshold)
    await attacker.setFlag('dnd5e','spellCriticalThreshold',newThreshold)
    await new Promise(r => setTimeout(r, 200));  
})
