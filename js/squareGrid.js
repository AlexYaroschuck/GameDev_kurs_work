var SG = SG || {};

SG.Rectangle = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.Width = width;
    this.Height = height;
};

SG.Square = function (id, x, y) {
    this.rect = new SG.Rectangle(x, y, 50, 50);
    this.Id = id;
    this.selected = false;
};

SG.Square.prototype.drowAndFill = function (ctx, color, showGrid = false) {
    if (!this.selected)
        ctx.strokeStyle = "grey";
    else
        ctx.strokeStyle = "black";

    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.rect(this.rect.x, this.rect.y, 50, 50);

    if (color) {
        ctx.fillStyle = color;
        ctx.fill();
    }

    if (showGrid) {
        ctx.font = "4px";
        ctx.fillStyle = "#000";
        // ctx.fillText(this.Id, this.Points[0].X - 3,
        //     this.Points[0].Y + 18);
    }

    ctx.closePath();
    ctx.stroke();
};

SG.Square.prototype.clear = function (ctx) {
    this.drowAndFill(ctx, 'white');
}

SG.Square.prototype.isInBounds = function (x, y) {
    return this.Contains(new SG.Point(x, y));
};

SG.Square.prototype.isInHexBounds = function (/*Point*/ p) {
    if (this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
        p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y)
        return true;
    return false;
};


SG.Square.prototype.Contains = function (/*Point*/ p) {
    var isIn = false;
    if (this.isInHexBounds(p)) {
        var i, j = 0;
        for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++) {
            var iP = this.Points[i];
            var jP = this.Points[j];
            if (
                (
                    ((iP.Y <= p.Y) && (p.Y < jP.Y)) ||
                    ((jP.Y <= p.Y) && (p.Y < iP.Y))
                    //((iP.Y > p.Y) != (jP.Y > p.Y))
                ) &&
                (p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)
            ) {
                isIn = !isIn;
            }
        }
    }
    return isIn;
};


