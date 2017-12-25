var Game = Game || {};

//in row = 33;
//int rows = 32
//TODO clear canvas
Game.StaticData = {
	StartPoint: {},
	EndPoint: {},
	GridType: 'hex',	
};

Game.FilledPoints = new Array();

Game.InitHexagonGrid = function() {
   let width = 30;//30
   let height = 30;	//30

   let a = -3.0;
   let b = (-2.0 * width);
   let c = (Math.pow(width, 2)) + (Math.pow(height, 2));

   let z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);	

   HT.Hexagon.Static.WIDTH = width;
   HT.Hexagon.Static.HEIGHT = height;
   HT.Hexagon.Static.SIDE = z;

   Game.StaticData.Grid = new HT.Grid(1500, 1000);
}

Game.InitCanvas = function(){
   Game.StaticData.Canvas = document.getElementById("hexCanvas");
   Game.StaticData.Ctx =  Game.StaticData.Canvas.getContext('2d');
}

Game.DrowHexes = function (){
	 for(var h in Game.StaticData.Grid.Hexes){
		 Game.StaticData.Grid.Hexes[h].drowAndFill(Game.StaticData.Ctx);
	 }
}

Game.CanvasClickHandler = function(event){
    let hex = Game.StaticData.Grid.GetHexAt({x:event.pageX, y:event.pageY});  
	let color = 'gray'
	
	if(hex == null)
		return;
	
	if(PH.IsPolFilled(hex, Game.FilledPoints)){
		PH.ClearExistPoly(hex,Game.FilledPoints, Game.StaticData.Ctx);	
		return;
	}	
	
	if(Game.FilledPoints.find(x=> x.Color == 'green')== null)
		color = 'green'		;	
	else if(Game.FilledPoints.find(x=> x.Color == 'red') == null)
		color = 'red';	
	
	Game.FilledPoints.push({
		X: event.pageX,
		Y: event.pageY,
		Color: color,
		Polygon: hex,
		Id: hex.Id
	});	
	
    hex.drowAndFill(Game.StaticData.Ctx, color); 
}

Game.StartGame = function(){
	let startPoint = Game.FilledPoints.find(x=> x.Color == 'green');
	let endPoint = Game.FilledPoints.find(x=> x.Color == 'red');
	
	if(!startPoint || !endPoint)
		return;
	
	let startCoords = startPoint.Id.split("_");
	let endCoords = endPoint.Id.split("_");
	
	start = [+startCoords[0], +startCoords[1]]
	finish = [+endCoords[0], +endCoords[1]]
	walls = Game.ParseFilledPoints('gray');
	
	let pathlog = AH.RunAlgorithm(start, finish, walls, expandState, convertCoords, distance);
	
	AH.DrowAlgorithm(pathlog, Game.FilledPoints, Game.StaticData.GridType,Game.StaticData.Grid, Game.StaticData.Ctx);
}

Game.ParseFilledPoints = function (color){
	let arr = [];
	for(let h of Game.FilledPoints){
		if(h.Color != color)
			continue;
		
		let prs = h.Id.split("_");
		
		arr.push([+prs[0], +prs[1]])
		arr.push([+prs[0], +prs[1] +1])	
	}
	
	return arr;
}

Game.GetById = function(coords){
	return PH.GetById(coords,Game.StaticData.GridType, Game.StaticData.Grid);
}


