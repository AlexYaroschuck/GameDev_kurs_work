var AH = AH || {};

AH.StaticData = {
	Algorithm: 'AStar'
};

AH.RunAlgorithm = function(start, finish, walls, expandState, convertCoords, distance){
	switch(AH.StaticData.Algorithm){
		case 'AStar': 
			return AStar(start, finish, walls, expandState, convertCoords, distance);
		case 'Anneal':
			return Anneal(start, finish, walls, expandState, convertCoords, distance);
		case 'Dijkstra':
			return Dijkstra(start, finish, walls, expandState, convertCoords, distance);
	}
};

AH.DrowAlgorithm = function(pathlog, points, type, grid, ctx){
	for(let path of pathlog.path){
		
		let coords = `${path[0] < 0 ? path[0] * -1: path[0]}_${path[1]}`;
		
		let polygon = PH.GetById(coords, type, grid);
		
		if (/*path[0] % 2 == 1 && */polygon== null ){
			coords = `${path[0] < 0 ? path[0] * -1: path[0]}_${path[1] - 1}`;
			polygon = PH.GetById(coords, type, grid);
		}		
		
		if(polygon == null)
			continue;
		
		if(PH.IsPolFilled(polygon, points))
			continue;
		
		polygon.drowAndFill(ctx, 'yellow');
	}
};