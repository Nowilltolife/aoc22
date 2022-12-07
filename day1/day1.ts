import * as fs from 'fs'
import path from 'path'

function parse(input: string) {
    const lines = input.split('\n')
    var result: number[] = []
    var num = 0
    var biggest = {
        num: 0,
        index: 0
    }
    lines.forEach((line, index) => {
        if (line === '' || index == lines.length - 1) {
            if(index == lines.length - 1) {
                num += parseInt(line)
            }
            if(num > biggest.num) {
                biggest.num = num
                biggest.index = result.length
            }
            result.push(num)
            num = 0
        } else {
            num += parseInt(line)
        }
    })
    // sort the array
    result = result.sort((a, b) => a - b)
    return {
        result,
        biggest
    }
}

const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8')
const parsed = parse(lines)
// get last 3 numbers from result array
const array = parsed.result.slice(parsed.result.length - 3)
// sum the array
const sum = array.reduce((a, b) => a + b, 0)
console.log(sum)