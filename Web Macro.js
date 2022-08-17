/*
  Create place template on macroPass, as the spellwill have to target self for the effect,
  @spelldc and origin may be passed directly to the effect;
  This will probably cause problems with Automated Animations, 
  Create animation directly with Sequencer in the future;

*/


if(args[0].macroPass ==="templatePlaced"){
    const casterToken = await fromUuid(args[0].tokenUuid)
    const template = await fromUuid(args[0].templateUuid)
    const size = canvas.grid.size
    const spelldc = args[0].actor.data.attributes.spelldc
    await DAE.setFlag(casterToken.actor,"WebFlags",[template.data.x,template.data.y,spelldc,args[0].itemUuid])
    await casterToken.actor.createEmbeddedDocuments("ActiveEffect",[getEffectData()])
}

if(args[0] === "on"){
    const lastArg = args[args.length-1]
    const casterToken = await fromUuid(lastArg.tokenUuid)
    const templateX = casterToken.actor.data.flags.dae.WebFlags[0]
    const templateY = casterToken.actor.data.flags.dae.WebFlags[1]
    const spelldc = casterToken.actor.data.flags.dae.WebFlags[2]
    const origin = casterToken.actor.data.flags.dae.WebFlags[3]
    if(args[0] === 'on'){
        let hookId = Hooks.on('updateToken',(token,changes)=>{
            if(!('x' in changes||'y' in changes))return;
            let px = token.data.x;
            let py = token.data.y;
            let center = token.data.height*canvas.grid.size/2;
            let size = canvas.grid.size;
            if(px+center<templateX)return;
            if(px+center>templateX+4*size)return;
            if(py+center<templateY)return;
            if(py+center>templateY+4*size)return;
            rollEffectItem(token)
        })
        let hookId2 = Hooks.on('updateCombat',(combat,turn,opions,userId)=>{
            let token = canvas.scene.tokens.get(combat.current.tokenId)
            let px = token.data.x;
            let py = token.data.y;
            let center = token.data.height*canvas.grid.size/2;
            let size = canvas.grid.size;
            if(px+center<templateX)return;
            if(px+center>templateX+4*size)return;
            if(py+center<templateY)return;
            if(py+center>templateY+4*size)return;
            rollEffectItem(token)
        })
        let hookId3 = Hooks.on('deleteActiveEffect',async (document)=>{
            if(document.data.label != 'Concentrating')return;
            if(document.data.origin != origin)return;
            webConcentrationId = await casterToken.actor.effects.filter(i=>i.data.label === 'Web Concentration').map(i=>i.id)
            await casterToken.actor.deleteEmbeddedDocuments('ActiveEffect',webConcentrationId)
            for(let token of canvas.scene.tokens){
                //token.actor.deleteEmbeddedDocuments('ActiveEffect',token.actor.effects.filter(i=>i.data.flags?.dae?.origin === origin).map(i=>i.id))
                await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: token.actor.uuid, effects: token.actor.effects.filter(i=>i.data.flags?.dae?.origin === origin).map(i=>i.id)})
            }
    casterToken.actor.deleteEmbeddedDocuments("ActiveEffect",[lastArg.effectId])
            Hooks.off('updateToken',hookId)
            Hooks.off('updateCombat',hookId2)
            Hooks.off('deleteActiveEffect',hookId3)        
        })
    }
}

async function rollEffectItem(token){
    if(token.actor.effects.filter(i=>i.data.flags.dae.origin === origin).length > 0)return;
    let item = await casterToken.actor.createEmbeddedDocuments('Item',[getItemData()])
    await MidiQOL.completeItemRoll(item[0], {targetUuids: [token.uuid]});
    casterToken.actor.deleteEmbeddedDocuments('Item',[item[0].id])
}

function getItemData(){
    return {
        'name': 'Web Effect',
        'type': 'spell',
        'img': 'systems/dnd5e/icons/spells/shielding-spirit-3.jpg',
        'data': {
            'description': {
                'value': '',
                'chat': '',
                'unidentified': ''
            },
            'activation': {
                'type': 'none',
                'cost': 0,
                'condition': ''
            },
            'ability': '',
            'actionType': 'save',
            'save': {
                'ability': 'dex',
                'dc': null,
            },
            'level': 0,
            'school': 'con',
        },
        'effects': [
            {
                'changes': [
                    {
                        'key': 'data.attributes.movement.all',
                        'mode': 0,
                        'value': '*0',
                        'priority': '20'
                    },
                    {
                        'key': 'flags.midi-qol.grants.advantage.attack.all',
                        'mode': 2,
                        'value': '0',
                        'priority': '20'
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.attack.all',
                        'mode': 2,
                        'value': '0',
                        'priority': '20'
                    },
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                        'mode': 2,
                        'value': '0',
                        'priority': '20'
                    },
                    {
                        'key': 'macro.itemMacro',
                        'mode': 0,
                        'value': '@attributes.spelldc',
                        'priority': '20'
                    }
                ],
                'disabled': false,
                'duration': {
                    'seconds': 3600,
                    'rounds': 600
                },
                'icon': 'icons/svg/net.svg',
                'label': 'Restrained',
                'origin':origin,
                'transfer': false,
                'flags': {
                    'dae': {
                        'stackable': 'none',
                        'transfer': false,
                        'origin':origin,
                    }
                },
            }
        ],
        'flags': {
            'itemacro': {
                'macro': {
                    'data': {
                        '_id': null,
                        'name': 'Web Effect',
                        'type': 'script',
                        'author': 'U3VAAELfq3wUHjF9',
                        'img': 'icons/svg/dice-target.svg',
                        'scope': 'global',
                        'command': "const lastArg = args[args.length-1];\nconst spelldc = args[1];\nconst token = await fromUuid(lastArg.tokenUuid);\nif(args[0] === \'on\'){\n    token.actor.createEmbeddedDocuments(\'Item\',[getItemData()])\n}\nif(args[0] === \'off\'){\n    let effects = token.actor.items.filter(i=>i.name === \'Free from Web\')\n    token.actor.deleteEmbeddedDocuments(\'Item\',effects.map(i=>i.id))\n}\nfunction getItemData(){\n    return {\n    \'name\': \'Free from Web\',\n    \'type\': \'feat\',\n    \'img\': \'systems/dnd5e/icons/spells/shielding-spirit-3.jpg\',\n    \'data\': {\n        \'description\': {\n            \'value\': \'\',\n            \'chat\': \'\',\n            \'unidentified\': \'\'\n        },\n        \'source\': \'\',\n        \'activation\': {\n            \'type\': \'action\',\n            \'cost\': 1,\n            \'condition\': \'\'\n        },\n        \'duration\': {\n            \'value\': null,\n            \'units\': \'\'\n        },\n        \'target\': {\n            \'value\': null,\n            \'width\': null,\n            \'units\': \'\',\n            \'type\': \'self\'\n        },\n        \'range\': {\n            \'value\': null,\n            \'long\': null,\n            \'units\': \'self\'\n        },\n        \'uses\': {\n            \'value\': null,\n            \'max\': \'\',\n            \'per\': \'\'\n        },\n        \'consume\': {\n            \'type\': \'\',\n            \'target\': \'\',\n            \'amount\': null\n        },\n        \'ability\': \'str\',\n        \'actionType\': \'abil\',\n        \'attackBonus\': 0,\n        \'chatFlavor\': \'\',\n        \'critical\': {\n            \'threshold\': null,\n            \'damage\': \'\'\n        },\n        \'damage\': {\n            \'parts\': [],\n            \'versatile\': \'\'\n        },\n        \'formula\': \'\',\n        \'save\': {\n            \'ability\': \'\',\n            \'dc\': null,\n            \'scaling\': \'flat\'\n        },\n        \'requirements\': \'\',\n        \'recharge\': {\n            \'value\': null,\n            \'charged\': false\n        }\n    },\n    \'effects\': [],\n    \'folder\': null,\n    \'sort\': 0,\n    \'permission\': {\n        \'default\': 0\n    },\n    \'flags\': {\n        \'midi-qol\': {\n            \'effectActivation\': false,\n            \'onUseMacroName\': \'[postActiveEffects]ItemMacro\'\n        },\n        \'itemacro\': {\n            \'macro\': {\n                \'data\': {\n                    \'_id\': null,\n                    \'name\': \'Free from Web\',\n                    \'type\': \'script\',\n                    \'author\': \'U3VAAELfq3wUHjF9\',\n                    \'img\': \'icons/svg/dice-target.svg\',\n                    \'scope\': \'global\',\n                    \'command\': `let token = await fromUuid(args[0].tokenUuid)\\nlet check = await token.actor.rollAbilityTest('str')\\nif(check.total < ${spelldc}){\\nreturn;}\\ntoken.actor.deleteEmbeddedDocuments(\\\'ActiveEffect\\\',[\\\'${lastArg.effectId}\\\'])`,\n                    \'folder\': null,\n                    \'sort\': 0,\n                    \'permission\': {\n                        \'default\': 0\n                    },\n                    \'flags\': {}\n                }\n            }\n        }\n    }\n}\n}",
                        'folder': null,
                        'sort': 0,
                        'permission': {
                            'default': 0
                        },
                        'flags': {}
                    }
                }
            }
        }
    }
}
