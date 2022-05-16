x := 0
if(x1>x2){
	x1 := x1+x2
	x2 := x1-x2
	x1 := x1-x2
}
loop
{
	y := y1+(x*((y2-y1)/(x2-x1)))
	y := Round(y)
	xx := x+x1
	MouseClick,Left,xx,y
	x++
}
Until xx > x2
