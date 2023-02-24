const lastArg = args[args.length-1]
const template = {x,y,size}
const actorSource = await MidiQOL.MQfromActorUuid(lastArg.actorUuid)
const tokens = canvas.placeables.tokens.map(t=>({x:t.x,y:t.y,id:t.id}))
const movementHookId = Hooks.on("updateToken",(document,update)=>{

})

foundry.utils.lineSegmentIntersects


//const template = {x:155,y:272,size:80}
//const grid = {size:10}
const linesX = []
const linesY = []
for(let x = 0 ; x < template.x + template.size ; x += grid.size){
    if(x < template.x - template.size) continue;
    let y1 = template.y - Math.sqrt(template.size*template.size-(template.x-x)*(template.x-x))
    let y2 = template.y + Math.sqrt(template.size*template.size-(template.x-x)*(template.x-x))
    linesX.push({x,y1,y2})
}
for(let y = 0 ; y < template.y + template.size ; y += grid.size){
    if(y < template.y - template.size) continue;
    let x1 = template.x - Math.sqrt(template.size*template.size-(template.y-y)*(template.y-y))
    let x2 = template.x + Math.sqrt(template.size*template.size-(template.y-y)*(template.y-y))
    linesY.push({y,x1,x2})
}







async function useItem(actorSource,targetUuid,dice){
    const [item] = await actorSource.createEmbeddedDocuments("Item",[getItemData(dice)])
    await MidiQOL.completeItemUse(item,{},{targetUuid})
    await actorSource.deleteEmbeddedDocuments("Item",[item.id])
}



function getItemData(dice){
    return {
        name:"Spike Growth Damage",
        type:"spell",
        damage: {
            "parts": [
              [
                `${dice}d4`,
                "piercing"
              ]
            ],
          },
    }
}
