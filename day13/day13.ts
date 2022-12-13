const { sum, getTestCases, extractAfter } = require('../lib')

function compare(a: any, b: any): boolean {
    if (typeof a == 'number' && typeof b == 'number') { 
        return a < b
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        for (var i = 0; i < Math.min(a.length, b.length); i++) {
            if (compare(a[i], b[i])) {
                return true
            }
            if (compare(b[i], a[i])) {
                return false
            }
        }
        return a.length < b.length
    }
    if (typeof a == 'number') {
        return compare([a], b)
    }
    if (typeof b == 'number') {
        return compare(a, [b])
    }
    throw new Error('Invalid input')
}

function parse(lines: string[]): any {
    var output = []
    while (lines.length) {
        const a = lines.shift()
        const b = lines.shift()
        if (lines.length) lines.shift()
        output.push(eval(a))
        output.push(eval(b))
    }
    return output
}

function part1(lines: string[]): number[] {
    // take 2 lines
    var indecies: number[] = []
    var currentIndex = 1
    while (lines.length) {
        const a = lines.shift()
        const b = lines.shift()
        if (lines.length) lines.shift()
        if (compare(eval(a), eval(b))) {
            indecies.push(currentIndex)
        }
        currentIndex++
    }
    return indecies
}

function part2(lines: string[]): number {
    var parsed = parse(lines)
    parsed.push([[2]])
    parsed.push([[6]])
    parsed = parsed.sort((a, b) => compare(a, b) ? -1 : 1)
    // find devider keys
    var divKey1 = 0
    var divKey2 = 0
    for (var i = 0; i < parsed.length; i++) {
        var arr = parsed[i]
        if (arr.length === 1 && Array.isArray(arr[0])) {
            arr = arr[0]
            if (arr.length == 1 && typeof (arr[0]) === 'number') {
                if (arr[0] === 2) {
                    divKey1 = i + 1
                }
                if (arr[0] === 6) {
                    divKey2 = i + 1
                }
            }
        }
    }

    return divKey1 * divKey2
}

const numbers = part1(getTestCases(__dirname))
console.log(sum(numbers))
const res = part2(getTestCases(__dirname))
console.log(res)