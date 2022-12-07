import * as fs from 'fs'
import path from 'path'

const ROCK = 1
const PAPER = 2
const SCISSORS = 3

const LOSS = 0
const DRAW = 3
const WIN = 6

const map = {
    'A': ROCK,
    'B': PAPER,
    'C': SCISSORS,
    'X': ROCK,
    'Y': PAPER,
    'Z': SCISSORS
}

const goalMap = {
    1: { // lose
        1: SCISSORS,
        2: ROCK,
        3: PAPER
    },
    2: { // draw
        1: ROCK,
        2: PAPER,
        3: SCISSORS
    },
    3: { // win
        1: PAPER,
        2: SCISSORS,
        3: ROCK
    }
}

const goals = {
    0: LOSS,
    1: DRAW,
    2: WIN
}

function win(oponent: number, you: number): number {
    const option = goalMap[you][oponent]
    return goals[you-1] + option
}

function rps(oponent: number, you: number): number {
    var outcome = 0
    if(oponent == you) {
        return DRAW + you
    }
    switch(oponent) {
        case ROCK: {
            switch(you) {
                case PAPER: outcome = WIN; break;
                case SCISSORS: outcome = LOSS; break;
            }
            break;
        }
        case PAPER: {
            switch(you) {
                case ROCK: outcome = LOSS; break;
                case SCISSORS: outcome = WIN;
            }
            break;
        }
        case SCISSORS: {
            switch(you) {
                case ROCK: outcome = WIN; break;
                case PAPER: outcome = LOSS; break;
            }
            break;
        }
    }
    return outcome + you;
}

function parse(line: string): { oponent: number, you: number } {
    const options = line.split(' ')
    return {
        oponent: map[options[0]],
        you: map[options[1]]
    }
}

function game(lines: string[], gameFn: (a: number, b: number) => number) {
    var sum = 0
    lines.forEach((value, index) => {
        const result = parse(value)
        sum += gameFn(result.oponent, result.you)
    })
    return sum
}

const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8')
const result = game(lines.split('\n'), win)

console.log(lines.split('\n'))

console.log(result)