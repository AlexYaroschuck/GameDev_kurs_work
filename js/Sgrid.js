SG.Grid = function (/*double*/ width, /*double*/ height) {
    this.Rects = [];
    let iSize = width / 50;
    let jSize = height / 50;
    let col = -1;
    let row = -1;
    for (let i = 0; i < iSize; i++) {
        row++;
        for (let j = 0; j < jSize; j++) {
            col++;
            let x = i * 50;
            let y = j * 50;
            Game.StaticData.Ctx.strokeStyle = "grey";
            Game.StaticData.Ctx.rect(x, y, 50, 50);
            Game.StaticData.Ctx.stroke();
            var id = `${col}_${row}`;
            var square = new SG.Square(id, x, y);
            this.Rects.push(square);
        }
        col = -1;
    }
};

SG.Grid.prototype.GetHexAt = function (p) {
    for (var h in this.Rects) {
        var x = p.x;
        var y = p.y;
        var z1 = this.Rects[h].rect.x;
        var z2 = this.Rects[h].rect.y;
        var z3 = this.Rects[h].rect.x + 50;
        var z4 = this.Rects[h].rect.y + 50;
        if (isInsideRect(x, y, z1, z2, z3, z4)) {
            return this.Rects[h];
        }
    }

    return null;
};

/**
 * Входит ли точка в прямоугольную область
 * на оси координат.
 *
 * @param {int} x - координата точки
 * @param {int} y - координата точки
 * @param {int} z1 - top left X координата прямоугольника
 * @param {int} z2 - top left Y координата прямоугольника
 * @param {int} z3 - bottom right X координата прямоугольника
 * @param {int} z4 - bottom right Y координата прямоугольника
 * @returns {Boolean}
 */
function isInsideRect(x, y, z1, z2, z3, z4) {
    x1 = Math.min(z1, z3);
    x2 = Math.max(z1, z3);
    y1 = Math.min(z2, z4);
    y2 = Math.max(z2, z4);
    if ((x1 <= x) && (x <= x2) && (y1 <= y) && (y <= y2)) {
        // console.log(x1 + "," + x + "," + x2);
        // console.log(y1 + "," + y + "," + y2);
        return true;
    } else {
        return false;
    }
}

SG.Grid.prototype.GetRectById = function (id) {
    for (var i in this.Rects) {
        if (this.Rects[i].Id == id) {
            return this.Rects[i];
        }
    }
    return null;
};