let actorUser = await fromUuid(args[0].actorUuid)
let itemUsed = await fromUuid(args[0].sourceItemUuid)
if(itemUsed.data.data.uses.value == 0){
    // Insert the amount of damage inside the Roll() keep the ""
    let dRoll = await new Roll("2d6").roll()
    // If you want a fix amound of damage you can set damage to the amount instead of rolling
    let damage = dRoll.total
    // Display a chat message
    ChatMessage.create({content: `The ${itemUsed.data.name} exploded causing ${damage} damage to ${actorUser.data.name}`})
    // This update the current HP value of the actor, this is not exactly damage, but I don't know what mods you are using
    //actorUser.update({'data.attributes.hp.value':actorUser.data.data.attributes.hp.value - damage})
    actorUser.applyDamage(damage)
    // Atention, this line will delete the item from the actor sheet, you should have a backup in the Item Directory, just in case
    actorUser.deleteEmbeddedDocuments('Item',[args[0].itemData._id])
}
