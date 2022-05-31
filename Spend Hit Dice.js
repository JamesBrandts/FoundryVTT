//This is prepared to be used as an Item Macro;
const lastArg = args[args.length-1];
const actorA = game.actors.get(lastArg.actorId);
//If you want to use this as a raw macro, in the macro bar, to use by the selected token comment the 2 previous lines and uncomment the next one
//const actorA = canvas.tokens.controlled[0].actor
let hd = retrieveHD(actorA);
let hdTotal = 0
for(let hDiceCount of hd){
    hdTotal += hDiceCount
}
let hdOptions = '';
for(let i = 1;i<=hdTotal;i++){
    hdOptions += `<option value = ${i}>${i}</option>`;
}
let opt = `<div class="form-group"><label for="exampleSelect">Quantity: </label><select name="exampleSelect">${hdOptions}</select></div>`
let d = await new Dialog({
    title: 'Spend Hit Dice for Elemental Surge Point',
    content: opt,
    buttons: {
    yes: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: (html) => {
        let select = html.find('[name="exampleSelect"]').val();
        surgePoints(actorA,select)    
        },
    },
}}
).render(true)
async function retrieveHD(actorA){    
    let hdAll = [0,0,0,0];
    let hd6 = actorA.data.items.filter(i=>i.data.data.hitDice == "d6");
    for (let hdClass of hd6){
        hdAll[0] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed;
    }
    let hd8 = actorA.data.items.filter(i=>i.data.data.hitDice == "d8");
    for (let hdClass of hd8){
        hdAll[1] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed;
    }
    let hd10 = actorA.data.items.filter(i=>i.data.data.hitDice == "d10");
    for (let hdClass of hd10){
        hdAll[2] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed;
    }
    let hd12 = actorA.data.items.filter(i=>i.data.data.hitDice == "d12");
    for (let hdClass of hd12){
        hdAll[3] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed;
    }
    return hdAll;
}    

async function surgePoints(actorA,points){
    for(let i = 0;i<points;i++){
        if(spent = actorA.data.items.find(i=>i.data.data.hitDice == "d6" && i.data.data.levels > i.data.data.hitDiceUsed)){
            spent.update({'data.hitDiceUsed':spent.data.data.hitDiceUsed+1})
            actorA.update({'resources.tertiary.value':actorA.data.resources.tertiary.value + 1})
            if(i>1){
                    let damageRoll = await new Roll("d6").evaluate()
                    damageRoll.toMessage()
                    let damage = damageRoll.total
                    actorA.applyDamage(damage)
            }
        }
        if(spent = actorA.data.items.find(i=>i.data.data.hitDice == "d8" && i.data.data.levels > i.data.data.hitDiceUsed)){
            spent.update({'data.hitDiceUsed':spent.data.data.hitDiceUsed+1})
            actorA.update({'resources.tertiary.value':actorA.data.resources.tertiary.value + 1})
            if(i>1){
                    let damageRoll = await new Roll("d8").evaluate()
                    damageRoll.toMessage()
                    let damage = damageRoll.total
                    actorA.applyDamage(damage)
            }
        }
        if(spent = actorA.data.items.find(i=>i.data.data.hitDice == "d10" && i.data.data.levels > i.data.data.hitDiceUsed)){
            spent.update({'data.hitDiceUsed':spent.data.data.hitDiceUsed+1})
            actorA.update({'resources.tertiary.value':actorA.data.resources.tertiary.value + 1})
            if(i>1){
                    let damageRoll = await new Roll("d10").evaluate()
                    damageRoll.toMessage()
                    let damage = damageRoll.total
                    actorA.applyDamage(damage)
            }
        }
        if(spent = actorA.data.items.find(i=>i.data.data.hitDice == "d12" && i.data.data.levels > i.data.data.hitDiceUsed)){
            spent.update({'data.hitDiceUsed':spent.data.data.hitDiceUsed+1})
            actorA.update({'resources.tertiary.value':actorA.data.resources.tertiary.value + 1})
            if(i>1){
                    let damageRoll = await new Roll("d12").evaluate()
                    damageRoll.toMessage()
                    let damage = damageRoll.total
                    actorA.applyDamage(damage)
            }
        }
    }
}
