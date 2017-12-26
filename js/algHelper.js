var AH = AH || {};

AH.StaticData = {
    Algorithm: ''
};

AH.RunAlgorithm = function (start, finish, walls, expandState, convertCoords, distance) {
    switch (AH.StaticData.Algorithm) {
        case 'AStar':
            return AStar(start, finish, walls, expandState, convertCoords, distance);
        case 'Anneal':
            return Anneal(start, finish, walls, expandState, convertCoords, distance);
        case 'Dijkstra':
            return Dijkstra(start, finish, walls, expandState, convertCoords, distance);
    }
};

AH.DrowAlgorithm = function (pathlog, points, type, grid, ctx) {
    let i = 0;

    let interval = setInterval(_ => {
        if (i >= pathlog.path.length) {
            clearInterval(interval);
            return;
        }

        let path = pathlog.path[i];
        let coords = `${path[0] < 0 ? path[0] * -1 : path[0]}_${path[1]}`;

        let polygon = PH.GetById(coords, type, grid);

        if (/*path[0] % 2 == 1 && */polygon == null) {
            coords = `${path[0] < 0 ? path[0] * -1 : path[0]}_${path[1] - 1}`;
            polygon = PH.GetById(coords, type, grid);
        }

        i++;

        if (polygon == null)
            return;

        if (PH.IsPolFilled(polygon, points))
            return;

        points.push({
            Color: 'yellow',
            Polygon: polygon,
            Id: polygon.Id
        })

        polygon.drowAndFill(ctx, 'yellow');


    }, 50);
};

AH.DrowAlgorithmPath = function (pathlog, points, type, grid, ctx) {
    let i = 0;
    let interval = setInterval(_ => {
        if (i >= pathlog.log.length) {
            clearInterval(interval);
            AH.DrowAlgorithm(pathlog, points, type, grid, ctx);
            return;
        }

        let pathl = pathlog.log[i];
        for (let path of pathl.opened) {
            let coords = `${path[0] < 0 ? path[0] * -1 : path[0]}_${path[1]}`;

            let polygon = PH.GetById(coords, type, grid);

            if (/*path[0] % 2 == 1 && */polygon == null) {
                coords = `${path[0] < 0 ? path[0] * -1 : path[0]}_${path[1] - 1}`;
                polygon = PH.GetById(coords, type, grid);
            }

            if (polygon == null)
                continue;

            if (PH.IsPolFilled(polygon, points))
                continue;

            polygon.drowAndFill(ctx, '#d3d3d3');
        }

        i++;
    }, AH.StaticData.Algorithm == 'Anneal' ? 10 : 35);
};