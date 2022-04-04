if(args[0] == "off"){
    let actorA = game.actors.get(args[2].actorId)
    let hdAll = [0,0,0,0]
    let hd6 = actorA.data.items.filter(i=>i.data.data.hitDice == "d6")
    for (let hdClass of hd6){
        hdAll[0] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed
    }
    let hd8 = actorA.data.items.filter(i=>i.data.data.hitDice == "d8")
    for (let hdClass of hd8){
        hdAll[1] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed
    }
    let hd10 = actorA.data.items.filter(i=>i.data.data.hitDice == "d10")
    for (let hdClass of hd10){
        hdAll[2] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed
    }
    let hd12 = actorA.data.items.filter(i=>i.data.data.hitDice == "d12")
    for (let hdClass of hd12){
        hdAll[3] += hdClass.data.data.levels - hdClass.data.data.hitDiceUsed
    }
    let hdOptions = ''
    let options = []
    if(hdAll[0]>0){
        hdOptions += '<option value = d6> d6 (' + hdAll[0] + ' Available)</option>'
        options.push('d6')
    }
    if(hdAll[1]>0){
        hdOptions += '<option value = d8> d8 (' + hdAll[1] + ' Available)</option>'
        options.push('d8')
    }
    if(hdAll[2]>0){
        hdOptions += '<option value = d10> d10 (' + hdAll[2] + ' Available)</option>'
        options.push('d10')
    }
    if(hdAll[3]>0){
        hdOptions += '<option value = d12> d12 (' + hdAll[3] + ' Available)</option>'
        options.push('d12')
    }

    if(options.length > 1){
        let opt = '<div class="form-group"><label for="exampleSelect">Select spell slot</label><select name="exampleSelect">' + hdOptions + '</select></div>'

        let d = await new Dialog({
            title: 'Create sorcery points',
            content: opt,
            buttons: {
            yes: {
                icon: '<i class="fas fa-check"></i>',
                label: 'OK',
                callback: (html) => {
                let select = html.find('[name="exampleSelect"]').val();
                healActor(actorA,select)    
                },
            },
        }}
        ).render(true)
    }
    if(options.length == 1){
        healActor(actorA,options[0]) 
    }
}
async function healActor(actorA,dice){
    let diceH = dice + '+' + actorA.data.data.abilities.con.mod
    let healRoll = await new Roll(diceH).evaluate()
    healRoll.toMessage()
    let heal = healRoll.total
    actorA.applyDamage(-heal)
    let spent = actorA.data.items.find(i=>i.data.data.hitDice == dice && i.data.data.levels > i.data.data.hitDiceUsed)
    spent.update({'data.hitDiceUsed':spent.data.data.hitDiceUsed+1})    
}
