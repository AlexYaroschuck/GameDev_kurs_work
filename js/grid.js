HT.Grid = function(/*double*/ width, /*double*/ height) {
	
	this.Hexes = [];
	//setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
	var HexagonsByXOrYCoOrd = {}; //Dictionary<int, List<Hexagon>>

	var row = 0;
	var y = 0.0;
	
	while (y + HT.Hexagon.Static.HEIGHT <= height)
	{
		var col = 0;

		var offset = 0.0;
		
		if (row % 2 == 1)
		{
			if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
				offset = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
			else
				offset = HT.Hexagon.Static.WIDTH / 2;
			col = 1;
		}
		
		var x = offset;
		while (x + HT.Hexagon.Static.WIDTH <= width)
		{		    
			let tRow = row;
			let tCol = col;
			
			
			var hexId = `${col}_${row}`;//this.GetHexId(row, col);
			var h = new HT.Hexagon(hexId, x, y);
			
			var pathCoOrd = col;
			if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
				h.PathCoOrdX = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy
			else {
				h.PathCoOrdY = row;
				pathCoOrd = row;
			}
			
			this.Hexes.push(h);
			
			if (!HexagonsByXOrYCoOrd[pathCoOrd])
				HexagonsByXOrYCoOrd[pathCoOrd] = [];
			
			HexagonsByXOrYCoOrd[pathCoOrd].push(h);

			col+=2;
			
			if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
				x += HT.Hexagon.Static.WIDTH + HT.Hexagon.Static.SIDE;
			else
				x += HT.Hexagon.Static.WIDTH;
		}
		
		row++;
		
		if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
			y += HT.Hexagon.Static.HEIGHT / 2;
		else
			y += (HT.Hexagon.Static.HEIGHT - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	for (var coOrd1 in HexagonsByXOrYCoOrd)
	{
		var hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
		var coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
		for (var i in hexagonsByXOrY)
		{
			var h = hexagonsByXOrY[i];//Hexagon
			if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
				h.PathCoOrdY = coOrd2++;
			else
				h.PathCoOrdX = coOrd2++;
		}
	}
};

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

HT.Grid.prototype.GetHexId = function(row, col) {
	var letterIndex = row;
	var letters = "";
	while(letterIndex > 25)
	{
		letters = HT.Grid.Static.Letters[letterIndex%26] + letters;
		letterIndex -= 26;
	}
		
	return HT.Grid.Static.Letters[letterIndex] + letters + (col + 1);
};

HT.Grid.prototype.GetHexAt = function(p) {
	for (var h in this.Hexes)
	{
        if(isPointInPoly(p, convertPoints(this.Hexes[h])))
		{
			return this.Hexes[h];
		}
	}

	return null;
};

var convertPoints = function(hex){
    let points = [];
    
    for(let p of hex.Points){
      /*  points.push({
            x: p.X,
            y: p.Y
        });*/
        points.push([p.X, p.Y]);
    }
    
    return points;
}

var isPointInPoly = function(point, vs){
 var x = point.x, y = point.y;
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
}

HT.Grid.prototype.GetHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	var deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id == id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};