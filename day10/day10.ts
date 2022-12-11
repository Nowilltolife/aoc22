import { getTestCases } from "../lib"

interface CPU {
    cycles: number,
    x: number,
    signals: number[],
    sprite: number,
    frame: string[],
    frames: string[]
}

function cycle(cpu: CPU, atEnd: () => void = () => {}) {
    const crtPos = (cpu.cycles % 40)
    if(crtPos >= cpu.sprite && crtPos <= cpu.sprite+2) {
        cpu.frame.push('#')
    } else {
        cpu.frame.push('.')
    }
    if(cpu.cycles % 40 == 0) {
        cpu.frames.push(cpu.frame.join(''))
        cpu.frame = []
    }
    atEnd()
    cpu.cycles++
    if(cpu.cycles == 20 || ((cpu.cycles-20) % 40) == 0) {
        cpu.signals.push(cpu.cycles * cpu.x)
    }
}

function execute(inst: string, arg: number, cpu: CPU) {
    switch(inst) {
        case 'noop': {
            cycle(cpu)
            break;
        }
        case 'addx': {
            cycle(cpu)
            cpu.x += arg
            cpu.sprite = cpu.x-1
            cycle(cpu)
            break;
        }
    }
}

function executeInstructions(lines: string[], cpu: CPU) {
    lines.forEach(line => {
        if(line == 'noop') execute('noop', 0, cpu)
        else {
            const [name, numArg] = line.split(' ')
            const arg = parseInt(numArg)
            execute(name, arg, cpu)
        }
    })
}

const cpu = {
    cycles: 1, x: 1, signals: [], sprite: 0, frame: [], frames: []
}

executeInstructions(getTestCases(__dirname), cpu)
console.log(cpu.frames)
// the frames are offset by 1 pixel but you can still see the characters if you just shift the answers by 1, lol