var Game = Game || {};

//in row = 33;
//int rows = 32
//TODO clear canvas
Game.StaticData = {
    GridType: '',
    Grid: {},
    Ctx: {}
};

Game.FilledPoints = new Array(); //Points that are filled)) like start, end, wall etc.
/* example {
		X: event.pageX, //i think we don't need X and Y but don't remove) 
		Y: event.pageY,
		Color: color, // like red green, used like a type
		Polygon: hex, // polygon, complex object mb later we ll use it
		Id: hex.Id // id for fast search
	};	
*/

Game.InitHexagonGrid = function () {
    let width = 30;//30
    let height = 30;	//30

    let a = -3.0;
    let b = (-2.0 * width);
    let c = (Math.pow(width, 2)) + (Math.pow(height, 2));

    let z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
    Game.StaticData.GridType = 'hexagon';
    Game.StaticData.Grid = new HT.Grid(1000, 1000);
    Game.DrowHexes();
}

Game.InitSquareGrid = function () {
    Game.StaticData.GridType = 'square';
    Game.StaticData.Grid = new SG.Grid(1000, 1000);
}

Game.InitGrid = function (type) {
    switch (type) {
        case 'hexagon':
            Game.InitHexagonGrid();
            break;
        case 'square':
            Game.InitSquareGrid();
            break;
        default:
            break;
    }
}

Game.ChangeAlg = function () {
    let type = parseInt($(this).val());
    switch (type) {
        case 0:
            AH.StaticData.Algorithm = 'Dijkstra';
            $("#alg").text("Chosen Algorithm: Dijkstra");
            break;
        case 1:
            AH.StaticData.Algorithm = 'AStar';
            $("#alg").text("Chosen Algorithm: AStar");
            break;
        case 2:
            AH.StaticData.Algorithm = 'Anneal';
            $("#alg").text("Chosen Algorithm: Anneal");
            break;
    }

}

Game.InitCanvas = function () {
    Game.StaticData.Canvas = document.getElementById("hexCanvas");
    Game.StaticData.Ctx = Game.StaticData.Canvas.getContext('2d');
}

Game.ClearGrid = function () {
    Game.ReinitGrid();
    Game.FilledPoints = [];
}

Game.ReinitGrid = function (clearPoints = false, type) {
    if (clearPoints) {
        Game.FilledPoints = [];
    }
    Game.StaticData.Ctx.clearRect(0, 0, 1000, 1000);//TODO depends on type
    if (type === undefined) {
        type = Game.StaticData.GridType;
    }
    Game.InitGrid(type);
}

Game.ClearAlg = function () {
    Game.ReinitGrid();

    for (let p of Game.FilledPoints) {
        if (p.Color == 'yellow')
            continue;

        p.Polygon.drowAndFill(Game.StaticData.Ctx, p.Color)
    }

    for (let i = Game.FilledPoints.length - 1; i >= 0; i--) {
        let item = Game.FilledPoints[i];
        if (item.Color == 'yellow') {
            Game.FilledPoints.splice(Game.FilledPoints.indexOf(item), 1);
        }
    }
}

Game.DrowHexes = function () {
    for (var h in Game.StaticData.Grid.Hexes) {
        Game.StaticData.Grid.Hexes[h].drowAndFill(Game.StaticData.Ctx);
    }
}

Game.CanvasClickHandler = function (event) {
    if (Game.StaticData.GridType === '') {
        return;
    }
    let hex = Game.StaticData.Grid.GetHexAt({x: event.pageX, y: event.pageY});
    let color = 'gray'

    if (hex == null)
        return;

    if (PH.IsPolFilled(hex, Game.FilledPoints)) {
        PH.ClearExistPoly(hex, Game.FilledPoints, Game.StaticData.Ctx);
        return;
    }

    if (Game.FilledPoints.find(x => x.Color == 'green') == null)
        color = 'green';
    else if (Game.FilledPoints.find(x => x.Color == 'red') == null)
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

Game.StartGame = function () {
    let startPoint = Game.FilledPoints.find(x => x.Color == 'green');
    let endPoint = Game.FilledPoints.find(x => x.Color == 'red');
    if (Game.StaticData.GridType === '') {
        alert('Choose grid type');
        return;
    }
    if (!startPoint || !endPoint) {
        alert('You must choose start-end points');
        return;
    }
    if (AH.StaticData.Algorithm === '') {
        alert('Choose algorithm');
        return;
    }


    let startCoords = startPoint.Id.split("_");
    let endCoords = endPoint.Id.split("_");

    start = [+startCoords[0], +startCoords[1]]
    finish = [+endCoords[0], +endCoords[1]]
    walls = Game.ParseFilledPoints('gray');

    let pathlog = AH.RunAlgorithm(start, finish, walls, expandState, convertCoords, distance);

    AH.DrowAlgorithmPath(pathlog, Game.FilledPoints, Game.StaticData.GridType,
        Game.StaticData.Grid, Game.StaticData.Ctx)
}

Game.ParseFilledPoints = function (color) {
    let arr = [];
    for (let h of Game.FilledPoints) {
        if (h.Color != color)
            continue;

        let prs = h.Id.split("_");

        arr.push([+prs[0], +prs[1]])
        arr.push([+prs[0], +prs[1] + 1])
    }

    return arr;
}

Game.GetById = function (coords) {
    return PH.GetById(coords, Game.StaticData.GridType, Game.StaticData.Grid);
}


