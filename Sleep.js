//Work on progress
//Deffines variables based on args[0], feeded by ItemMacro
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemD = args[0].item;
let hp_pool = args[0].damageTotal
//Define targets list
const targetsA = []
for (let i=0;i<args[0].targets.length;i++){
    let target = canvas.tokens.get(args[0].targets[i]._id);
    targetsA.push(target)
}
//Sort targets list in crescent order by HP value
targetsA.sort(function(a,b){return a.actor.data.data.attributes.hp.value - b.actor.data.data.attributes.hp.value})
//Runs through targets list, verifying if the targets are immune, are uncouncious, apply the effect and reduces the HP from the pool.
for (let i=0;i<targetsA.length;i++){
    if (!isUnconscious(targetsA[i])){
        if (!isImumune(targetsA[i])){
            if (targetsA[i].actor.data.data.attributes.hp.value <= hp_pool){
                const effectData = {
                    changes: [
                        {key: "StatusEffect", value: "combat-utility-belt.unconscious", mode: 0, priority: 20},
                    ],

                    disabled: false,
                    duration: {rounds: 10 , seconds: undefined, startRound: undefined, startTime: undefined, startTurn: undefined, turns: undefined},
                    icon: "systems/dnd5e/icons/spells/light-magenta-1.jpg",
                    label: "Sleep",
                    tint: null,
                    transfer: false,
                    flags: {dae : {specialDuration: ["turnStart"]}}
                }
                targetsA[i].actor.createEmbeddedDocuments("ActiveEffect", [effectData])                

            }
    hp_pool -= targetsA[i].actor.data.data.attributes.hp.value
    }}
}
//Function to verify if the target token is Immune to Sleep or enchantments
function isImumune(token){
    try{
        if (token.actor.data.data.details.race.toLowerCase().includes('elf')){return true;}
        if (token.actor.data.data.details.race.toLowerCase().includes('drow')){return true;}
    } catch(e){}
    try{
        if (token.actor.data.data.details.type.value.toLowerCase().includes('undead')){return true;}
    }catch(e){}
    try{
	for (let j = 0; j < canvas.tokens.conthp_pooled[0].actor.data.data.traits.ci.value.length ; j++){
    	if (canvas.tokens.conthp_pooled[0].actor.data.data.traits.ci.value[j].toLowerCase() === 'charmed'){
        	return true;
    	}
        if (canvas.tokens.conthp_pooled[0].actor.data.data.traits.ci.value[j].toLowerCase() === 'sleep'){
            return true;
        }
}}catch(e){}
return false;
}
//Function to verify is unconcious
function isUnconscious(token){
for (let i=0;i<token.actor.data.effects._source.length;i++){
    if (token.actor.data.effects._source[i].label === 'Unconscious'){return true;}}
return false;
}
//game.cub.getConditions(token/s)
