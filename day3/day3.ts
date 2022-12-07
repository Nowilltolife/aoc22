import * as fs from 'fs'
import path from 'path'

function findMatch(a: string, b: string): string {
    for(var i = 0; i < a.length; i++) {
        const search = a[i]
        if(b.indexOf(search) > -1) {
            return search
        }
    }
    return undefined
}

function findMatch3(a: string, b: string, c: string): string {
    for(var i = 0; i < a.length; i++) {
        const search = a[i]
        if(b.indexOf(search) > -1 && c.indexOf(search) > -1) {
            return search
        }
    }
    return undefined
}

const azAZ = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function priority(a: string): number {
    return azAZ.indexOf(a) + 1
}

function matchRucksack(items: string): number {
    const a = items.substring(0, items.length / 2)
    const b = items.substring(items.length / 2)
    const match = findMatch(a, b)
    return priority(match)
}

function matchRucksacks(items: string[]): number {
    return items.map(matchRucksack).reduce((a, b) => a + b, 0)
}

function findBadge(items: string[]): number {
    // find the common letter in the 3 items
    const match = findMatch3(items[0], items[1], items[2])
    return priority(match)
}

function findBadges(items: string[]): number {
    var arrays: string[][] = []
    items.forEach((item, index) => {
        if(index % 3 == 0) {
            arrays.push([])
        }
        arrays[arrays.length - 1].push(item)
    })
    return arrays.map(findBadge).reduce((a, b) => a + b, 0)
}

const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8')

console.log(findBadges(lines.split('\n')))