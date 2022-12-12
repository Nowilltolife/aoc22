import { getTestCases } from "../lib"

type Id = number

interface pos {
    x: number,
    y: number
}

interface Mountain {
    start: pos,
    end: pos,
    map: number[][]
}

const NUMBER_BASE = 'a'.charCodeAt(0)

function parseMountain(lines: string[]): Mountain {
    var start: pos
    var end: pos
    var map = lines.map((line, y) => {
        return [...line].map((value, x) => {
            if (value == "S") {
                start = { x, y }
                return 0 // lowest
            } else if (value == "E") {
                end = { x, y }
                return 25 // highest
            }
            return value.charCodeAt(0) - NUMBER_BASE
        })
    })

    return {
        start,
        end,
        map
    }

}

const MAGIC_NUMBER = 1337

function point(x, y): Id {
    return y * MAGIC_NUMBER + x;
}

function reversePoint(int: Id): pos {
    return {
        y: Math.floor(int / MAGIC_NUMBER),
        x: int % MAGIC_NUMBER,
    };
}

type DijkstraResult = { distances: { [key: Id]: number }, endPoint: Id }
type AdjacentFunction = (point: pos, map: number[][]) => Id[]
type DoneFunction = (u: Id) => boolean
function dijkstra(map: number[][], start: pos, getAdj: AdjacentFunction, isDone: DoneFunction): DijkstraResult {
    const distances = {};
    const prev = {};
    var queue = [];
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            distances[point(x, y)] = Number.MAX_SAFE_INTEGER;
            queue.push(point(x, y));
        }
    }

    distances[point(start.x, start.y)] = 0;

    var resultingPoint = null;
    while (queue.length > 0) {
        // sort queue by distance
        queue.sort((a, b) => distances[a] - distances[b]);
        var min = queue[0];

        if (isDone(min)) {
            resultingPoint = min;
            break;
        }

        // remove min from queue
        queue = queue.slice(1);

        const p = reversePoint(min);
        const n = getAdj(p, map);
        for (const neighbor of n) {
            if (queue.includes(neighbor)) {
                const alt = distances[min] + 1;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = min;
                }
            }
        }
    }

    return {
        distances,
        endPoint: resultingPoint
    }
}

function nextHighNeighbor(p: pos, map: number[][]): Id[] {
    const res = [];
    if (p.y + 1 < map.length && map[p.y + 1][p.x] <= map[p.y][p.x] + 1) {
        res.push(point(p.x, p.y + 1));
    }
    if (p.y - 1 >= 0 && map[p.y - 1][p.x] <= map[p.y][p.x] + 1) {
        res.push(point(p.x, p.y - 1));
    }
    if (p.x + 1 < map[p.y].length && map[p.y][p.x + 1] <= map[p.y][p.x] + 1) {
        res.push(point(p.x + 1, p.y));
    }
    if (p.x - 1 >= 0 && map[p.y][p.x - 1] <= map[p.y][p.x] + 1) {
        res.push(point(p.x - 1, p.y));
    }
    return res;
}

function nextLowNeighbor(p: pos, map: number[][]): Id[] {
    const res = [];
    if (p.y + 1 < map.length && map[p.y + 1][p.x] >= map[p.y][p.x] - 1) {
        res.push(point(p.x, p.y + 1));
    }
    if (p.y - 1 >= 0 && map[p.y - 1][p.x] >= map[p.y][p.x] - 1) {
        res.push(point(p.x, p.y - 1));
    }
    if (p.x + 1 < map[p.y].length && map[p.y][p.x + 1] >= map[p.y][p.x] - 1) {
        res.push(point(p.x + 1, p.y));
    }
    if (p.x - 1 >= 0 && map[p.y][p.x - 1] >= map[p.y][p.x] - 1) {
        res.push(point(p.x - 1, p.y));
    }
    return res;
}

const mountain = parseMountain(getTestCases(__dirname))
const map = mountain.map
const { distances, endPoint: p1 } = dijkstra(map, mountain.start, nextHighNeighbor, (u) => u == point(mountain.end.x, mountain.end.y))
console.log(distances[point(mountain.end.x, mountain.end.y)]) // part 1
const { distances: distances2, endPoint: p2 } = dijkstra(map, mountain.end, nextLowNeighbor, (u) => { // start from E and go to point where height == 0
    const p = reversePoint(u)
    return map[p.y][p.x] === 0
})
console.log(distances2[p2]) // part 2