Hooks.on("midi-qol.damageRollComplete",async (workflow)=>{
    const token = await fromUuid(workflow.tokenUuid)
    //Absorb Elements:
    if(["acid","cold","fire","lightning","thunder"].includes(workflow.item.damageParts[0].type)){
        for(let target of workflow.targets){
            target.actor.items.filter(item => item.flags.DAE.name === "Absorb Elements")
            .map(item =>item.update({action:"manual"}))
            target.actor.setFlag("elementaDamage",workflow.item.damageParts[0].type)
        }
    }
    else {
        for(let target of workflow.targets){
            target.actor.items.filter(item => item.flags.DAE.name === "Absorb Elements")
            .map(item =>item.update({action:"reaction"}))
        }
    }
    //Armor of Agathys
    for(let target of workflow.targets){
        if(target.actor.flags.DAE.ArmorOfAgathysDamage && ["mwak","msak"].includes(workflow.item.actionType)){
            await dealArmorOfAgathysDamage(token,target,target.actor.flags.DAE.ArmorOfAgathysDamage)
        }
    }
})


async function dealArmorOfAgathysDamage(token,target,damage){
    const itemData = {
        'name': 'Web Effect',
        'type': 'spell',
        'img': 'systems/dnd5e/icons/spells/shielding-spirit-3.jpg',
        'damage': {
            "parts": [
              [
                `${damage}`,
                "cold"
              ]
            ],
          },
    }
    let item = await target.actor.createEmbeddedDocuments('Item',[itemData])
    await MidiQOL.completeItemUse(item[0],{}, {targetUuids: [token.uuid]});
    target.actor.deleteEmbeddedDocuments('Item',[item[0].id])
}
