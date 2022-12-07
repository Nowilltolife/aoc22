import { getTestCases } from "../lib"

interface range {
    lower: number,
    upper: number
};

function range(range: string): range {
    const parsed = range.split('-')
    return {
        lower: parseInt(parsed[0]),
        upper: parseInt(parsed[1])
    }
}

function overlapComplete(a: range, b: range): boolean {
    const aBigger = (a.lower <= b.lower && a.upper >= b.upper)
    const bBigger = (b.lower <= a.lower && b.upper >= a.upper)
    return aBigger || bBigger
}

function overlap(a: range, b: range): boolean {
    if(a.upper == a.lower) {
        const n = a.upper;
        return n >= b.lower && n <= b.upper
    }
    if(b.upper == b.lower) {
        const n = b.upper;
        return n >= a.lower && n <= a.upper
    } 
    for(var i = a.lower; i < a.upper; i++) {
        if(i >= b.lower && i <= b.upper) return true
    }
    for(var i = b.lower; i < b.upper; i++) {
        if(i >= a.lower && i <= a.upper) return true
    }
    return false
}

function testCases(lines: string[], fn: (a: range, b: range) => boolean): boolean[] {
    const results = []
    lines.forEach((line, index) => {
        const parsed = line.split(',')
        const a = range(parsed[0])
        const b = range(parsed[1])
        results.push(fn(a, b))
    })
    return results
}

const result = testCases(getTestCases(__dirname), overlap)
var count = 0
result.forEach((val) => {
    if(val) count++
})
console.log(count)