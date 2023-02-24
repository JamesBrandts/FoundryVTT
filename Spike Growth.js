const lastArg = args[args.length-1]
const template = {x,y,size}
const actorSource = await fromUuid(lastArg.actorUuid)
const tokens = canvas.placeables.tokens.map(t=>({x:t.x,y:t.y,id:t.id}))

