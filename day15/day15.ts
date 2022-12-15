import { extractAfter, getTestCases } from '../lib';

interface Signals {
    min: number,
    max: number,
    fields: number[][]
}

const NUMBER_PATTERN = /\-?\d+/g

function manhattanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function getData(lines: string[]) {
    return lines.map((sensor) => sensor.match(NUMBER_PATTERN).map(Number))
}

function parseSignals(data: number[][]): Signals {
    return data.reduce((field, [sX, sY, bX, bY]) => {
            const range = manhattanDistance(sX, sY, bX, bY)
            field.min = Math.min(field.min, sX - range, bX)
            field.max = Math.max(field.max, sX + range, bX)
            field.fields.push([sX, sY, bX, bY, range])
            return field
        }, { min: Infinity, max: -Infinity, fields: [] });
}

function findImpossiblePositions(y: number, signals: Signals): number {
    var count = 0
    for(let x = signals.min; x <= signals.max; x++) {
        for(const [sX, sY, bX, bY] of signals.fields) {
            if(x === bX && y === bY) continue

            const distance = manhattanDistance(x, y, sX, sY)
            if(distance <= manhattanDistance(sX, sY, bX, bY)) {
                count++
                break
            }

        }
    }
    return count
}

function findBeaconPosition(upper: number, signals: Signals): number {
    var x = 0
    var y = 0
    while(true) {
        if(x > upper && y > upper) return -1 // if we are out of bounds, return -1 (no beacon found
        // try to find a signal that is in range
        const inRange = signals.fields.find(([sX, sY, bX, bY, range]) => {
            const distance = manhattanDistance(x, y, sX, sY)
            return distance <= range
        })
        
        if(!inRange) { // this is the beacon
            return (x * 4000000) + y
        }

        const [sX, sY, bX, bY, range] = inRange
        const distance = manhattanDistance(x, y, sX, sY)

        const skip = range - distance + 1 // we know that the entire range of the sensor must be skipped
        const nextX = x + skip
        x = nextX > upper ? 0 : nextX // if we are out of bounds, reset x to 0 and increment y
        y = nextX > upper ? y + 1 : y // if we are out of bounds, increment y
    }
}

const data = getData(getTestCases(__dirname))
const field = parseSignals(data)
const impossible = findImpossiblePositions(2000000, field)
console.log(impossible)
const beacon = findBeaconPosition(4000000, field)
console.log(beacon)