var PH = PH || {};


//Wrapper for get By Id Method
//returns polygon on specific position on grid, 
//id - > column_row
//id example 34_27
PH.GetById = function(id, type, grid){
	switch(type) {
		case 'hex':
			return grid.GetHexById(id);
	}
}

PH.IsPolFilled = function(polygon, points){
	let currItem = points.find(x=> x.Id == polygon.Id);
		
	return currItem == null ? false: true;			
}

PH.ClearExistPoly = function(poly, points, ctx){
	let existedPoly = points.find(x=> x.Id == poly.Id);
	
	if(!existedPoly)
		return;
	
	let index = points.indexOf(existedPoly);	
	
	if(index == -1)
		return;
	
	points.splice(index,1);
	
	poly.clear(ctx);
}

PH.ClearAll = function(){
	
}