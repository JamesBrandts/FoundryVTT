let posX = canvas.scene.dimensions.sceneWidth+canvas.scene.dimensions.paddingX
let posY = canvas.scene.dimensions.sceneHeight+canvas.scene.dimensions.paddingY
let soundPath = "HOMM4-Sounds/sound.spell.lightning.wav"
let lightData = {
    "x": posX,
    "y": posY,
    "rotation": 0,
    "walls": true,
    "vision": false,
    "config": {
        "dim": 0,
        "bright": 100000,
        "angle": 0,
        "alpha": 0.5,
        "darkness": {
            "min": 0,
            "max": 1
        },
        "coloration": 1,
        "gradual": false,
        "luminosity": 0.3,
        "saturation": 0,
        "contrast": 0,
        "shadows": 0,
        "color": "#ffffff"
    },
    "hidden": false,
    "flags": {}
}
let luz = await canvas.scene.createEmbeddedDocuments('AmbientLight',[lightData])
await new Promise(resolve => setTimeout(resolve,200));
canvas.scene.deleteEmbeddedDocuments('AmbientLight',[luz[0].data._id])
AudioHelper.play({src: soundPath, volume: 1, loop: false}, true);
