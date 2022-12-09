import { getTestCases } from "../lib"

interface Rope {
    head: number,
    tail: number,
    size: number
    visited: number[]
}

interface KnotRope {
    head: number,
    tails: number[],
    size: number
    visited: number[]
}

type direction = 'U' | 'D' | 'R' | 'L' | 'UL' | 'UR' | 'DL' | 'DR'
const directions: direction[] = ['U', 'D', 'R', 'L', 'UL', 'UR', 'DL', 'DR']
const inverse: { [K in direction]: direction } = {
    'U': 'D',
    'D': 'U',
    'R': 'L',
    'L': 'R',
    'UL': 'DR',
    'UR': 'DL',
    'DL': 'UR',
    'DR': 'UL'
}

function initialize(size: number): Rope {
    const center = Math.floor(size / 2) * size + Math.floor(size / 2)
    return {
        head: center,
        tail: center,
        size,
        visited: [center]
    }
}

function initializeKnot(size: number, numTails: number): KnotRope {
    const center = Math.floor(size / 2) * size + Math.floor(size / 2)
    const tails = []
    for (var i = 0; i < numTails; i++) {
        tails.push(center)
    }
    return {
        head: center,
        tails,
        size,
        visited: [center]
    }
}

function offset(dir: direction, size: number): number {
    switch (dir) {
        case 'U': return -size;
        case 'D': return size;
        case 'R': return 1;
        case 'L': return -1;
        case 'UL': return -size - 1;
        case 'UR': return -size + 1;
        case 'DL': return size - 1;
        case 'DR': return size + 1;
    }
}

function isNear(p1: number, p2: number, size: number): boolean {
    if (p1 == p2) return true
    for (var dir of directions) {
        if (offset(dir, size) + p1 == p2) return true
    }
    return false
}

function getMoveDirection(goal: number, pos: number, size: number): direction {
    if (goal == pos) return null
    for (var dir of directions) {
        if (offset(dir, size) + pos == goal) return dir
    }
    return null
}

function move(rope: Rope, dir: direction) {
    var pos = rope.head
    var off = offset(dir, rope.size)
    // move position
    pos += off
    // check if distance to tail is near 
    if (!isNear(rope.tail, pos, rope.size)) {
        // get the inverse of the direction, move the tail to pos+offset(inverse, rope.size)
        rope.tail = pos + offset(inverse[dir], rope.size)
        // rope.visited should only have unique values
        if (rope.visited.indexOf(rope.tail) == -1) rope.visited.push(rope.tail)
    }
    rope.head = pos
}

function moveKnot(rope: KnotRope, dir: direction) {
    var pos = rope.head
    var off = offset(dir, rope.size)
    // move position
    pos += off
    rope.head = pos
    // check if distance to tail is near
    // test first tail interaction determines the new direction
    // the goal move is towards the inverse of the first tail interaction
    var goal = pos - off
    dir = getMoveDirection(goal, rope.tails[0], rope.size)
    if(dir == null) return
    // apply to all tails
    for (var i = 0; i < rope.tails.length; i++) {
        var tail = rope.tails[i]
        if (!isNear(tail, pos, rope.size)) {
            // we know where we need to move
            rope.tails[i] = tail + offset(dir, rope.size)
        }
        pos = rope.tails[i]
        dir = getMoveDirection(goal, rope.tails[i], rope.size)
    }
    
}

function drawRope(rope: Rope, onlyVisited: boolean): string {
    var result = ''
    for (var i = 1; i <= rope.size; i++) {
        for (var j = 1; j <= rope.size; j++) {
            const pos = i * rope.size - rope.size + j
            if (pos == rope.head && !onlyVisited) result += 'H'
            else if (pos == rope.tail && !onlyVisited) result += 'T'
            else if (rope.visited.indexOf(pos) != -1) result += '#'
            else result += '.'
        }
        result += '\n'
    }
    return result
}

function drawKnotRope(rope: KnotRope): string {
    var result = ''
    for (var i = 1; i <= rope.size; i++) {
        for (var j = 1; j <= rope.size; j++) {
            const pos = i * rope.size - rope.size + j
            if (pos == rope.head) result += 'H'
            else if (rope.tails.indexOf(pos) != -1) result += rope.tails.indexOf(pos) + 1
            else result += '.'
        }
        result += '\n'
    }
    return result
}

function executeInstructions(rope: Rope, lines: string[]) {
    lines.forEach((value) => {
        const split = value.split(' ')
        const dir = split[0] as direction
        const amount = parseInt(split[1])
        for (var i = 0; i < amount; i++) {
            move(rope, dir)
            console.log(drawRope(rope, false))
        }
    })
}

function executeInstructionsKnot(rope: KnotRope, lines: string[]) {
    lines.forEach((value) => {
        const split = value.split(' ')
        const dir = split[0] as direction
        const amount = parseInt(split[1])
        for (var i = 0; i < amount; i++) {
            moveKnot(rope, dir)
            console.log(drawKnotRope(rope))
        }
    })
}

const rope = initializeKnot(30, 9)
executeInstructionsKnot(rope, ['R 4', 'U 4'])
