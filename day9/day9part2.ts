import { getTestCases } from "../lib"

interface position {
    x: number,
    y: number
}

interface Rope {
    knots: position[],
    visited: string[]
}

type direction = 'U' | 'D' | 'R' | 'L'

function moveHead(head: position, dir: direction): position {
    switch (dir) {
        case 'U': return { x: head.x, y: head.y - 1 }
        case 'D': return { x: head.x, y: head.y + 1 }
        case 'R': return { x: head.x + 1, y: head.y }
        case 'L': return { x: head.x - 1, y: head.y }
    }
}

function moveTail(head: position, tail: position): position {
    // movement algorithm based on delta
    const buffer = { x: tail.x, y: tail.y }
    const delta = {
        x: head.x - tail.x,
        y: head.y - tail.y
    }
    const absDelta = {
        x: Math.abs(delta.x),
        y: Math.abs(delta.y)
    }
    if (absDelta.x < 2 && absDelta.y < 2) return buffer // no movement
    if (absDelta.x === 2 && absDelta.y === 2) {
        // move diagonally
        buffer.x += delta.x / 2
        buffer.y += delta.y / 2
        return buffer
    }
    if (absDelta.x === 2) {
        if(absDelta.y !== 0) {
            buffer.y = head.y // correct y
        }
        // move horizontally
        buffer.x += delta.x / 2
        return buffer
    }
    if (absDelta.y === 2) {
        if(absDelta.x !== 0) {
            buffer.x = head.x // correct x
        }
        // move vertically
        buffer.y += delta.y / 2
        return buffer
    }

    throw new Error('Invalid delta')
}

function init(): Rope {
    const tails: position[] = []
    for (var i = 0; i < 10; i++) {
        tails.push({ x: 0, y: 0 })
    }
    return {
        knots: tails,
        visited: []
    }
}

function step(rope: Rope, command: string) {
    const [ cmd, amount ] = command.split(' ')
    const amountNum = parseInt(amount)
    for(var i = 0; i < amountNum; i++) {
        rope.knots[0] = moveHead(rope.knots[0], cmd as direction)
        for(var j = 1; j < 10; j++) {
            rope.knots[j] = moveTail(rope.knots[j - 1], rope.knots[j])
        }
        rope.visited.push(`${rope.knots[9].x},${rope.knots[9].y}`)
    }
}

const rope = init()
const lines = getTestCases(__dirname)
lines.forEach(line => {
    step(rope, line)
})
// get the amount of unique positions
const unique = rope.visited.filter((v, i, a) => a.indexOf(v) === i)
console.log(unique.length)
