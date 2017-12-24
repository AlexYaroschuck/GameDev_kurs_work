var Game = Game || {};

//in row = 33;
//int rows = 32

Game.StaticData = {
	StartPoint: {},
	EndPoint: {}
};

Game.FilledPoints = new Array();

Game.InitGrid = function() {
   let width = 130;//30
   let height = 130;	//30

   let a = -3.0;
   let b = (-2.0 * width);
   let c = (Math.pow(width, 2)) + (Math.pow(height, 2));

   let z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);	

   HT.Hexagon.Static.WIDTH = width;
   HT.Hexagon.Static.HEIGHT = height;
   HT.Hexagon.Static.SIDE = z;

   Game.StaticData.Grid = new HT.Grid(1500, 1000);
  
   Game.InitCanvas();
   Game.DrowHexes();
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

Game.CanvasCkickHandler = function(event){
    let hex = Game.StaticData.Grid.GetHexAt({x:event.pageX, y:event.pageY});  
	let color = 'gray'
	
	if(hex == null)
		return;
	
	//TODO clear point
	
	if(Game.FilledPoints.length == 0){//TODO when clear decide on color
		color = 'green'		;
	}
	else if(Game.FilledPoints.length == 1){
		color = 'red';
	}
	
	Game.FilledPoints.push({
		X: event.pageX,
		Y: event.pageY,
		Color: color,
		Hex: hex
	});
	
	console.log(hex.Id)
	
    hex.drowAndFill(Game.StaticData.Ctx, color); 
}

Game.StartGame = function(){
	let startPoint = Game.FilledPoints.find(x=> x.Color == 'green');
	let endPoint = Game.FilledPoints.find(x=> x.Color == 'red');
	
	if(!startPoint || !endPoint)
		return;
	
	let startCoords = startPoint.Hex.Id.split("_");
	let endCoords = endPoint.Hex.Id.split("_");
	// Example
	start = [+startCoords[0], +startCoords[1]]
	finish = [+endCoords[0], +endCoords[1]]
	walls = []
//		[5, 5],
//		[5, 6],
//    	[5, 4],
//	]
	let pathlog = AStar(start, finish, walls, expandState, convertCoords, distance);
	
	console.log(pathlog)
	
	Game.DrowAlgorithm(pathlog)
}

Game.DrowAlgorithm = function(pathlog){
	for(let path of pathlog.path){
		
		let coords = `${path[0] < 0 ? path[0] * -1: path[0]}_${path[1]}`;
		
		let hex = Game.StaticData.Grid.GetHexById(coords);
		
		if (/*path[0] % 2 == 1 && */hex== null ){
			coords = `${path[0] < 0 ? path[0] * -1: path[0]}_${path[1] - 1}`;
			hex = Game.StaticData.Grid.GetHexById(coords);
		}
		
		
		
		//console.log(coords);
		
		
		if(hex == null)
		{
			console.log('null: ' + coords)
			continue;
		}
		
		let currItem = Game.FilledPoints.find(x=> x.Hex == hex);
		
		if(currItem != null)
		{
			console.log('Exists: ' + currItem.Hex.Id)
			continue;
		}
		
		hex.drowAndFill(Game.StaticData.Ctx, 'yellow');
	}
}



