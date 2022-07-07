if(args[0] === "on"){    
    const lastArg = args[args.length-1]
    const targetToken = canvas.tokens.get(lastArg.tokenId);
    const targetActor = targetToken.actor;
    const effectData = {
        "changes": [
            {
                "key": "flags.midi-qol.disadvantage.attack.all",
                "mode": 2,
                "value": "0",
                "priority": "20"
            }
        ],
        "disabled": false,
        "duration": {
            "turns": 1
        },
        "icon": "",
        "label": "Compelled Duel",
        "tint": "",
        "transfer": false,
        "flags": {
            "core": {
                "statusId": ""
            },
            "dae": {
                "macroRepeat": "none",
                "specialDuration": [
                    "1Attack"
                ]
            }
        }
    }
    let hookId = Hooks.on("midi-qol.preItemRoll", async(workflow) => {
        if(DAE.getFlag(token.actor,"AncestralProtectorsEnemy") === workflow.tokenId){
            let targets = Array.from(workflow.targets);
            if(targets[0].id === token.id)return;
            await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: workflow.token.actor.uuid, effects: [effectData]})
        }
        return;
    });
    DAE.setFlag(targetActor,"AncestralProtectorsHookId",hookId);
}
if(args[0] === "off"){   
    const lastArg = args[args.length-1] 
    const targetToken = canvas.tokens.get(lastArg.tokenId);
    const targetActor = targetToken.actor;
    Hooks.off("midi-qol.preItemRoll",DAE.getFlag(targetActor,"AncestralProtectorsHookId"))
    DAE.unsetFlag(token.actor,"AncestralProtectorsEnemy");
}
if(args[0].macroPass === "DamageBonus"){
    if(args[0].hitTargets.length <1)return;
    if(DAE.getFlag(token,"AncestralProtectorsEnemy"))return;
    DAE.setFlag(token.actor,"AncestralProtectorsEnemy",args[0].hitTargets[0].id);
}
if(args[0] === "each"){
    const lastArg = args[args.length-1]
    const tokenU = await fromUuid(lastArg.tokenUuid)
    DAE.unsetFlag(tokenU.actor,"AncestralProtectorsEnemy");
}
