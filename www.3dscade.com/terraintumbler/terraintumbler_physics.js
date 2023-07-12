var collisionlines = 0;
var collisionlinex1 = new Array();
var collisionliney1 = new Array();
var collisionlinex2 = new Array();
var collisionliney2 = new Array();
var minn = 0;
var colhs = 0;
var colvs = 0;

function point_line_dist_squared(linex1,liney1,linex2,liney2,pointx,pointy){
	var dx,dy,t;
	dx = linex2 - linex1;
	dy = liney2 - liney1;
	if ((dx == 0) && (dy == 0)) {
		x0 = linex1;
		y0 = liney1;
	}else{
		//t = Math.max(0,Math.min(((pointx - linex1) * dx + (pointy - liney1) * dy) / (dx * dx + dy * dy),1));
		t=((pointx - linex1) * dx + (pointy - liney1) * dy) / (dx * dx + dy * dy);
		if (t<0) 
			t=0;
		else if (t>1)
			t=1;
		x0 = linex1 + t * dx;
		y0 = liney1 + t * dy;
	}
	return (pointx-x0)*(pointx-x0)+(pointy-y0)*(pointy-y0);
}

function collision_prepare(x,y,radius,hspeed,vspeed){
	var paths, r, n, milp, malp, lx1, ly1, lx2, ly2;
	//radius to test within: the squared value of the speed and radius*1.1
	r=hspeed*hspeed+vspeed*vspeed+(radius*2)*(radius*2);
	collisionlines=0;
	milp=((x-radius*2)/16)|0;
	if (milp<0) milp=0;
	malp=Math.ceil((x+radius*2)/16);
	if (malp>70) malp=70;
	for(n=milp;n<malp;n++){
		lx1=n*16;
		ly1=level[levelCurrent].ylist[n];
		lx2=n*16+16;
		ly2=level[levelCurrent].ylist[n+1];
		if (point_line_dist_squared(lx1,ly1,lx2,ly2,x,y)<r){
			collisionlinex1[collisionlines]=lx1;
			collisionliney1[collisionlines]=ly1;
			collisionlinex2[collisionlines]=lx2;
			collisionliney2[collisionlines]=ly2;
			collisionlines+=1;
		}
	}
	return collisionlines;
}

function collision_test(x,y,radius,hspeed,vspeed){
	var n, r, m;
	r=radius*radius;
	for(n=0;n<collisionlines;n++){
		if (point_line_dist_squared(collisionlinex1[n],collisionliney1[n],collisionlinex2[n],collisionliney2[n],x+hspeed,y+vspeed)<r){
			minn=n;
			return true;
		}
	}
	return false;
}

function collision_reaction(x,y,radius,hspeed,vspeed){
	var n, dis, d, r, xx, yy, i, m;
	r=radius*radius;
	dis=r;
	for(n=minn;n<collisionlines;n++){
		d=point_line_dist_squared(collisionlinex1[n],collisionliney1[n],collisionlinex2[n],collisionliney2[n],x+hspeed,y+vspeed)
		if (d<dis){
			dis=d;
			xx=x0;
			yy=y0;
		}
	}

	dis=Math.sqrt(dis);
	colhs=(x+hspeed-xx)*(radius-dis)/radius;
	colvs=(y+vspeed-yy)*(radius-dis)/radius;
}