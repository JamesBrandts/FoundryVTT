Hooks.on("midi-qol.preAttackRoll", async (workflow) =>{
    console.log(workflow)
    const attacker = game.actors.get(workflow.actor.id)
    const targetAc = canvas.tokens.get(workflow.targets.ids[0]).actor.data.data.attributes.ac.value
    const attackBonus = workflow.item.labels.toHit
    const newThreshold = targetAc + 10 - eval('0' + attackBonus)
    console.log({'attacker':attacker,'targetAc':targetAc,'attackBonus':attackBonus,'newThreshold':newThreshold})
    if(newThreshold < 20){
        let effectData = {
            "flags": {
                "dae": {
                    "transfer": false,
                    "stackable": "none",
                    "macroRepeat": "none",
                    "specialDuration": ["1Attack"]
                }
            },
            "changes": [
                {
                    "key": "flags.dnd5e.weaponCriticalThreshold",
                    "mode": 5,
                    "value": newThreshold,
                    "priority": "20"
                },
                {
                    "key": "flags.dnd5e.spellCriticalThreshold",
                    "mode": 5,
                    "value": newThreshold,
                    "priority": "20"
                }
            ],
            "disabled": false,
            "duration": {
                "startTime": null,
                "turns":1
            },
            "icon": "systems/dnd5e/icons/skills/red_10.jpg",
            "label": "Encrised Critical",
            "tint": null,
            "transfer": false,
        }
        await attacker.createEmbeddedDocuments('ActiveEffect',[effectData])
        await new Promise(r => setTimeout(r, 200));
    }    
})
