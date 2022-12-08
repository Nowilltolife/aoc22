import { getTestCases } from "../lib"

interface crates {
    crates: string[][],
    amount: number,
}

interface instruction {
    amount: number,
    from: number,
    to: number
}

function crates(crates: string[][]): crates {
    const copy = crates
    for(var i = 0; i < crates.length; i++) {
        copy[i] = crates[i].reverse()
    }
    return {
        crates: copy,
        amount: crates.length,
    }
}

const SECOND_PART_REVERSE = true
function move(crates: crates, inst: instruction) {
    var result = []
    for (var i = 0; i < inst.amount; i++) {
        const elm = crates.crates[inst.from].pop()
        result.push(elm)
    }
    if(SECOND_PART_REVERSE) result = result.reverse()
    for(var elm of result) {
        crates.crates[inst.to].push(elm)
    }
}

const entryLength = 4
function parseInitial(lines: string[]): crates {
    const first = lines[0]
    const amount = (first.length + 1) / entryLength
    const data: string[][] = []
    for (var i = 0; i < amount; i++) {
        data[i] = []
    }
    lines.forEach((line, index) => {
        var stringIndex = 0
        for (var j = 0; j < amount; j++) {
            const first = line.charAt(stringIndex)
            if (first == '[') {
                const char = line.charAt(stringIndex + 1)
                data[j].push(char)
            }
            else if (first == ' ') {
                stringIndex += entryLength
                continue;
            }
            else return;
            stringIndex += entryLength
        }
    })
    return crates(data)
}

function parseInstruction(line: string): instruction {
    const split = line.split(' ')
    const word = split[0]
    const amount = parseInt(split[1])
    const from = parseInt(split[3]) - 1
    const to = parseInt(split[5]) - 1
    return { amount, from, to }
}

function executeInstructions(lines: string[], crates: crates) {
    lines.forEach((value) => {
        move(crates, parseInstruction(value))
    })
}

function getAnswer(crates: crates): string {
    var answer = ''
    crates.crates.forEach((arr, index) => {
        answer += arr[arr.length - 1]
    })
    return answer
}

var data = parseInitial(`    [S] [C]         [Z]            
[F] [J] [P]         [T]     [N]    
[G] [H] [G] [Q]     [G]     [D]    
[V] [V] [D] [G] [F] [D]     [V]    
[R] [B] [F] [N] [N] [Q] [L] [S]    
[J] [M] [M] [P] [H] [V] [B] [B] [D]
[L] [P] [H] [D] [L] [F] [D] [J] [L]
[D] [T] [V] [M] [J] [N] [F] [M] [G]
 1   2   3   4   5   6   7   8   9 `.split('\n'));
executeInstructions(getTestCases(__dirname), data)
console.log(getAnswer(data))
