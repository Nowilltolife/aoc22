import { getTestCases } from "../lib"

type direction = 'left' | 'right' | 'up' | 'down'
const directions: direction[] = [
    'left',
    'right',
    'up',
    'down'
]

class Grid {
    grid: number[]
    rows: number
    columns: number

    constructor(grid, rows, columns) {
        this.grid = grid
        this.rows = rows
        this.columns = columns
    }

    getEntry(column: number, row: number): number {
        if (column < 0 || column >= this.columns) return -1
        if (row < 0 || row >= this.rows) return -1
        return this.grid[column + (row * this.columns)]
    }
}

function parseGrid(grid: string): Grid {
    const lines = grid.split('\n')
    const rows = lines.length
    const columns = lines[0].length // assuming all lines are symetrical 
    var numGrid = []
    lines.forEach((line) => {
        for (var char of line) {
            numGrid.push(char)
        }
    })
    return new Grid(numGrid, rows, columns)
}

function inside(grid: Grid): Grid {
    // reduce array to inside 
    const newGrid = []
    const start = grid.columns + 1
    const end = grid.grid.length - (grid.columns + 1)
    for (var i = start; i < end; i++) {
        if (i % grid.columns == 0 || (i + 1) % grid.columns == 0) continue
        newGrid.push(grid.grid[i])
    }
    return new Grid(newGrid, grid.rows - 2, grid.columns - 2)
}

function searchDir(grid: Grid, startColumn: number, startRow: number, start: number, dir: direction): boolean {
    // search in a direction for a number greater than the start
    var column = startColumn
    var row = startRow
    while (true) {
        switch (dir) {
            case 'left':
                column--
                break
            case 'right':
                column++
                break
            case 'up':
                row--
                break
            case 'down':
                row++
                break
        }
        const val = grid.getEntry(column, row)
        if (val == -1) return true
        if (val >= start) return false
    }
}

function findNonVisible(grid: Grid): boolean[] {
    // consider each entry in the grid
    var result = []
    for (var row = 0; row < grid.rows; row++) {
        for (var column = 0; column < grid.columns; column++) {
            const start = grid.getEntry(column, row)
            var seen = false
            for (var dir of directions) {
                if (searchDir(grid, column, row, start, dir)) {
                    seen = true
                    break
                }
            }
            result.push(seen)
        }
    }
    return result
}

function findScenicScore(grid: Grid): number[] {

    function searchDir(grid: Grid, startColumn: number, startRow: number, start: number, dir: direction): number {
        // search in a direction for a number greater than the start
        var column = startColumn
        var row = startRow
        var count = 0
        while (true) {
            switch (dir) {
                case 'left':
                    column--
                    break
                case 'right':
                    column++
                    break
                case 'up':
                    row--
                    break
                case 'down':
                    row++
                    break
            }
            const val = grid.getEntry(column, row)
            if (val == -1) return count
            count++
            if (val >= start) return count
        }
    }

    var result = []
    for (var row = 0; row < grid.rows; row++) {
        for (var column = 0; column < grid.columns; column++) {
            const start = grid.getEntry(column, row)
            var scores = 1
            for (var dir of directions) {
                const score = searchDir(grid, column, row, start, dir)
                scores *= score
            }
            result.push(scores)
        }
    }
    return result
}

function countTrue(bools: boolean[]): number {
    var sum = 0
    for (var b of bools) {
        if (b) sum++
    }
    return sum
}

function findMax(nums: number[]) {
    return nums.reduce((a, b) => Math.max(a, b))
}

function format(bools: boolean[], grid: Grid): string {
    var output = ''
    for (var i = 0; i < bools.length; i++) {
        if (i % grid.columns == 0) output += '\n'
        output += result[i] ? '#' : '.'
    }
    return output
}

const grid = parseGrid(getTestCases(__dirname).join('\n'))
console.log(grid.grid)
var result = findNonVisible(grid)
console.log(format(result, grid))
console.log(countTrue(result))
var scores = findScenicScore(grid)
console.log(scores)
console.log(findMax(scores))
