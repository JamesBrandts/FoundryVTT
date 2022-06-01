array2 = []
for(let i = 0;i<6;i++){
    let array1 = []
    for(let i = 0;i<10;i++){
        array1.push(await rollTotal())
    }
    array2.push(array1)
}
console.table(array2)
async function rollTotal(){
    let r = await new Roll("3d6")
    return await r.total
}
function Roll(dice) {
    this.quant = dice.split("d")[0]
    this.faces = dice.split("d")[1].split("+")[0]
    this.bonus = dice.split("d")[1].split("+")[1]
    this.total = doRoll(this.quant,this.faces,this.bonus)
}    
async function doRoll(quant,faces,bonus=0){
    let total = Number(bonus)
    for(let i = 0;i<quant;i++){
        total += await RollDice(faces)
    }
    return total
}    
async function RollDice(faces){
    return Math.ceil(Math.random() * faces);
}
