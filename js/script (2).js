var gridType = 'hexagon'
var metric = 'euclidian'
var maxIters = 10000
var minX = -100
var maxX = 100
var minY = -100
var maxY = 100

// Convert weird coordinares to euclidian
coordAdapters = {
    'triangle': p => [p[0] * Math.sqrt(3), ((p[0] + 1) % 2) * (6 * Math.floor(p[1] / 2) + (p[1] % 2) * 4) + (p[0] % 2) * (1 + 6 * Math.floor(p[1] / 2) + (p[1] % 2) * 2)],
    'square': p => p,
    'hexagon': p => [p[0] + (p[1] % 2) / 2, p[1] * 2 / Math.sqrt(3)],
}

// Get nearest cells
stateExpandMethods = {
    'triangle': s => {
        if ((s[0] + s[1]) % 2)
            return [[s[0], s[1] + 1], [s[0] + 1, s[1]], [s[0] - 1, s[1]]]
        else
            return [[s[0], s[1] - 1], [s[0] + 1, s[1]], [s[0] - 1, s[1]]]
    },
    'square': s => [[s[0] - 1, s[1]], [s[0] + 1, s[1]], [s[0], s[1] - 1], [s[0], s[1] + 1]],
    'hexagon': s => {
        if (s[1] % 2)
            return [[s[0] - 1, s[1]], [s[0] + 1, s[1]], [s[0], s[1] - 1], [s[0], s[1] + 1], [s[0] + 1, s[1] + 1], [s[0] + 1, s[1] - 1]]
        else
            return [[s[0] - 1, s[1]], [s[0] + 1, s[1]], [s[0], s[1] - 1], [s[0], s[1] + 1], [s[0] - 1, s[1] + 1], [s[0] - 1, s[1] - 1]]
    },
}

// Filter cells with min-max bounds
filterBoundsWrapper = expand => s => expand(s).filter(_s => _s[0] > minX && _s[0] < maxX && _s[1] > minY && _s[1] < maxY)
for (var key in stateExpandMethods) {
    stateExpandMethods[key] = filterBoundsWrapper(stateExpandMethods[key])
}
// Filter cells with walls
filterWallsWrapper = expand => (s, w) => expand(s).filter(_s => !w.map(e => e.toString()).includes(_s.toString()))
for (var key in stateExpandMethods) {
    stateExpandMethods[key] = filterWallsWrapper(stateExpandMethods[key])
}

metrics = {
    'euclidian': (p1, p2) => Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])),
    'manhattan': (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]),
    'chebyshev': (p1, p2) => Math.min(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1])),
    'canberra': (p1, p2) => Math.abs(p1[0] - p2[0]) / (Math.abs(p1[0]) + Math.abs(p2[0])) + Math.abs(p1[1] - p2[1]) / (Math.abs(p1[1]) + Math.abs(p2[1]))
}

function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },

    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },

    remove: function (node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if (this.content[i] != node) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },

    size: function () {
        return this.content.length;
    },

    bubbleUp: function (n) {
        // Fetch the element that has to be moved.
        var element = this.content[n], score = this.scoreFunction(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunction(parent))
                break;

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    },

    sinkDown: function (n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score))
                    swap = child2N;
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
};


/*
  start: [x, y]
  finish: [x, y]
  walls: [
      [x1, y1],
      [x2, y2],
      ...
      [xn, yn],
  ]
*/
AStar = (start, finish, walls, expandState, convertCoords, distance) => {
    getRank = s => distance(convertCoords(start), convertCoords(s)) + distance(convertCoords(s), convertCoords(finish))
    path = s => {
        var curr = s;
        var path = [];
        while (curr.parent) {
            path.unshift(curr);
            curr = curr.parent;
        }
        if (path.length == 0)
            return [start];
        return path
    }

    log = []

    open = new BinaryHeap(p => getRank(p[p.length - 1]))
    closed1 = {}
    console.log(open);
    console.log(closed1);
    open.push(path(start))
    for (var i = 0; i < maxIters; i++) {
        p = open.pop()
        console.log(closed);
        x = p[p.length - 1]
        if (closed1[x.toString()]) {
            continue
        }
        if (finish.toString() == x.toString()) {
            return {path: p.map(p => [p[0], p[1]]), log: log}
        }
        closed1[x.toString()] = 1
        successors = expandState(x, walls)
        log.push({
            opened: open.content.map(x => x[x.length - 1]),
            closed1: Object.keys(closed1).map(e => JSON.parse('[' + e + ']'))
        })
        for (var k in successors) {
            successors[k].parent = x
            open.push(path(successors[k]))
        }
    }
}

Anneal = (start, finish, walls, expandState, convertCoords, distance) => {
    getRank = s => distance(convertCoords(s), convertCoords(finish))

    log = []

    path = []
    open = []

    current = start
    curRank = getRank(start)
    for (var T = 1; T < maxIters + 1; T++) {
        successors = expandState(current, walls)
        next = successors[Math.floor(Math.random() * successors.length)];
        nextRank = getRank(next)

        log.push({opened: open, closed: []})
        open = open.concat(successors)

        var prob = 1
        if (nextRank > curRank) {
           prob = Math.exp(-(nextRank - curRank) / (10 / Math.log10(T)))
        }
        if (Math.random() < prob) {
            path.push(next)
            current = next
            curRank = nextRank
        }

        if (finish.toString() == next.toString()) {
            return {path: path, log: log}
        }
    }
}

Dijkstra = (start, finish, walls, expandState, convertCoords, distance) => {
    getRank = s => distance(convertCoords(s), convertCoords(finish))

    V = []
    U = []
    d = {}
    p = {}
    for (var x = minX + 1; x < maxX; x++) {
        for (var y = minY + 1; y < maxY; y++) {
            V.push([x, y])
            d[[x, y]] = 1e100
            p[[x, y]] = []
        }
    }
    d[start] = 0
    d_U = JSON.parse(JSON.stringify(d))
    log = []
    open = []
    closed1 = []
    while (U.length < V.length) {
        v = Object.keys(d_U)[Object.values(d_U).indexOf(Math.min(...Object.values(d_U)))].split(',').map(e => parseInt(e))
        U.push(v.toString())
        delete(d_U[v.toString()])
        successors = expandState(v, walls)

        open = open.concat(successors)
        closed1.push(v)
        log.push({open: open, closed: closed1.map(e => e)})
        for (var u in successors) {
            u = successors[u]
            if (U.includes(u.toString()))
                continue
            w = getRank(u) - getRank(v)
            if (d[u] > d[v] + w) {
                d[u] = d[v] + w
                d_U[u] = d[u]
                p[u] = p[u] || []
                p[u] = p[v].map(e => e)
                p[u].push(u)
            }
            if (u.toString() == finish.toString())
                return {path: p[finish], log: log}
        }
    }
    return {path: p[finish], log: log}
}

convertCoords = coordAdapters[gridType]
expandState = stateExpandMethods[gridType]
distance = metrics[metric]

