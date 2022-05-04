//Requer Testes

Hooks.on("midi-qol.preAttackRoll", (workflow) =>{
    const attacker = fromUuid(workflow.actorUuid)
    const targetAc = canvas.tokens.get(workflow.targets.ids[0]).actor.data.data.attributes.ac.value
    const attackBonus = workflow.item.data.attackBonus //This is probably wrong
    const newThreshold = targetAc + 10 - attackBonus
    if(newThreshold < 20){
        let effectData = {
            "flags": {
                "dae": {
                    "transfer": false,
                    "stackable": "none",
                    "macroRepeat": "none",
                    "specialDuration": ["attack"] //verify
                }
            },
            "changes": [
                {
                    "key": "flags.dnd5e.weaponCriticalThreshold",
                    "mode": 0,
                    "value": newThreshold,
                    "priority": "20"
                },
                {
                    "key": "flags.dnd5e.spellCriticalThreshold",
                    "mode": 0,
                    "value": newThreshold,
                    "priority": "20"
                }
            ],
            "disabled": false,
            "duration": {
                "startTime": null
            },
            "icon": "systems/dnd5e/icons/skills/red_10.jpg",
            "label": "Encrised Critical",
            "tint": null,
            "transfer": false,
        }
        attacker.createEmbededDocuments('ActiveEffect',[effectData])
    }
    
})
