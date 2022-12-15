import { getTestCases } from '../lib'

interface pos {
    x: number,
    y: number
}

type Rocks = {[key: number]: {[key: number]: number}}

interface Cave {
    rocks: Rocks,
    start: number,
    end: number,
    depth: number,
    sand: pos[]
}

function parseCave(lines: string[]): Cave {
    const arr: Rocks = {}
    var start = 999
    var end = 0
    var depth = 0
    lines.forEach((inst, index) => {
        const paths = inst.split(' -> ')
        while(paths.length) {
            var [sX, sY] = paths.shift().split(',').map(v => parseInt(v))
            if(!paths.length) break
            var [eX, eY] = paths[0].split(',').map(v => parseInt(v))
            if( arr[sY] === undefined ) arr[sY] = {}
            if( arr[eY] === undefined ) arr[eY] = {}
            if(sX > eX) [sX, eX] = [eX, sX]
            if(sY > eY) [sY, eY] = [eY, sY]
            for(var x = sX; x <= eX; x++) {
                arr[sY][x] = 1
                arr[eY][x] = 1
            }
            for(var y = sY; y <= eY; y++) {
                if(arr[y] === undefined) arr[y] = {}
                arr[y][sX] = 1
                arr[y][eX] = 1
            }
            start = Math.min(start, sX)
            start = Math.min(start, eX) // make sure all are checked
            end = Math.max(end, eX)
            end = Math.max(end, sX)
            depth = Math.max(depth, eY)
        }
    })
    return {
        rocks: arr,
        sand: [],
        start,
        end,
        depth
    }
}

function showCave(cave: Cave) {
    const {rocks, sand, start, end, depth} = cave
    var str = '  '
    for(var x = start; x <= end; x++) {
        str += x - start
    }
    str += '\n'
    for(var y = 0; y <= depth; y++) {
        str += y + ' '
        const row = rocks[y]
        for(var x = start; x <= end; x++) {
            if(sand.find(pos => pos.x === x && pos.y === y)) str += 'o'
            else if(row && row[x]) str += '#'
            else str += '.'
        }
        str += '\n'
    }
    return str
}

function isFree(cave: Cave, pos: pos): boolean {
    const {rocks} = cave
    const rockCollision = rocks[pos.y] && rocks[pos.y][pos.x] === 1
    return !rockCollision
}

function placeSand(cave: Cave, pos: pos) {
    cave.sand.push(pos)
    // place it as collision in rocks
    if(cave.rocks[pos.y] === undefined) cave.rocks[pos.y] = {}
    cave.rocks[pos.y][pos.x] = 1
}

const CAVE_START = {x: 500, y: 0}
function fallSand(start: pos, cave: Cave): boolean {
    var current = {x: start.x, y: start.y}
    // fall
    while(isFree(cave, current)) {
        if(current.y >= cave.depth) return true
        current.y++
    }
    // hit
    current.y-- // move back
    // try left
    if(isFree(cave, dl())) {
        return fallSand(dl(), cave)
    }
    if(isFree(cave, dr())) {
        return fallSand(dr(), cave)
    }

    // nothing is possible, place sand at current position
    placeSand(cave, current)
    if(current.x == CAVE_START.x && current.y == CAVE_START.y) {
        // we are at the start, nothing is possible
        return true // we are done
    }
    return false
    function dl() {
        return {
            x: current.x - 1,
            y: current.y + 1
        }
    }

    function dr() {
        return {
            x: current.x + 1,
            y: current.y + 1
        }
    }
}

function addFloor(cave: Cave) {
    // add a floor at y = depth + 2 of double the width
    const depth = cave.depth + 2
    const start = Math.floor(cave.start / 1.43)
    const end = Math.floor(cave.end * 1.43)
    cave.rocks[depth] = {}
    for(var x = start; x <= end; x++) {
        cave.rocks[depth][x] = 1
    }

    cave.depth = depth
    cave.start = start
    cave.end = end
}

const cave = parseCave(getTestCases(__dirname))
addFloor(cave)
var i = 0
while(true) {
    if(fallSand(CAVE_START, cave)) break
    i++
}
i++ // part 2
console.log(showCave(cave), i)