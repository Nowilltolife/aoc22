import { extractAfter } from "../lib"

interface Monkey {
    worrys: number[],
    operation: (old: number) => number,
    test: number,
    ifTrue: number,
    ifFalse: number,
    inspected: number
}

var monkeys: Monkey[] = []
var modulos = 1
function inspectItems(monkey: Monkey) {
    var item = undefined
    while ((item = monkey.worrys.shift())) {
        var worryLevel = item // monkey takes item
        worryLevel = monkey.operation(worryLevel) // monkey inspects item
        //worryLevel = Math.floor(worryLevel / 3) // monkey gets bored (part 1)
        worryLevel = worryLevel % modulos // modulos with least common multiple to avoid overflow (part 2)
        const index = (worryLevel % monkey.test == 0) ? monkey.ifTrue : monkey.ifFalse // monkey decides where to throw item
        monkeys[index].worrys.push(worryLevel) // monkey throw item
        monkey.inspected++ // monkey happy
    }
}

function parseMonkey(description: string[]): Monkey {
    const [name, startingItemStr, operationStr, testStr, ifTrueStr, ifFalseStr] = description
    var startingItems: number[] = []
    const numbers = extractAfter(startingItemStr, ':').trim()
    numbers.split(', ').forEach(str => startingItems.push(parseInt(str)))
    const op = extractAfter(operationStr, 'old').trim().charAt(0)
    const numStr = extractAfter(operationStr, op).trim()
    var operation;
    if(numStr == 'old') {
        operation = (old: number) => old * old
    } else {
        const num = parseInt(numStr)
        switch(op) {
            case "*": operation = (old: number) => old * num; break;
            case "+": operation = (old: number) => old + num; break;
        }
    }
    var test = parseInt(extractAfter(testStr, 'by').trim())
    var ifTrue = parseInt(extractAfter(ifTrueStr, 'monkey').trim())
    var ifFalse = parseInt(extractAfter(ifFalseStr, 'monkey').trim())
    return {
        worrys: startingItems,
        operation,
        test,
        ifTrue,
        ifFalse,
        inspected: 0
    }
}

function parseMonkeys(input: string[]) {
    // each description is 5 lines long, divided by 1 empty line
    var descriptions: string[][] = []
    var description: string[] = []
    input.forEach(line => {
        if(line == '') {
            descriptions.push(description)
            description = []
        } else {
            description.push(line)
        }
    })
    descriptions.push(description)
    descriptions.forEach(description => {
        monkeys.push(parseMonkey(description))
    })
}

function step() {
    for(var monkey of monkeys) {
        inspectItems(monkey)
    }
}

function monkeyBusiness() {
    // get the top 2 monkeys with most inspected items
    var topMonkeys = monkeys.sort((a, b) => b.inspected - a.inspected).slice(0, 2)
    return topMonkeys[0].inspected * topMonkeys[1].inspected
}

parseMonkeys(`Monkey 0:
Starting items: 54, 53
Operation: new = old * 3
Test: divisible by 2
  If true: throw to monkey 2
  If false: throw to monkey 6

Monkey 1:
Starting items: 95, 88, 75, 81, 91, 67, 65, 84
Operation: new = old * 11
Test: divisible by 7
  If true: throw to monkey 3
  If false: throw to monkey 4

Monkey 2:
Starting items: 76, 81, 50, 93, 96, 81, 83
Operation: new = old + 6
Test: divisible by 3
  If true: throw to monkey 5
  If false: throw to monkey 1

Monkey 3:
Starting items: 83, 85, 85, 63
Operation: new = old + 4
Test: divisible by 11
  If true: throw to monkey 7
  If false: throw to monkey 4

Monkey 4:
Starting items: 85, 52, 64
Operation: new = old + 8
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 7

Monkey 5:
Starting items: 57
Operation: new = old + 2
Test: divisible by 5
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 6:
Starting items: 60, 95, 76, 66, 91
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 2
  If false: throw to monkey 5

Monkey 7:
Starting items: 65, 84, 76, 72, 79, 65
Operation: new = old + 5
Test: divisible by 19
  If true: throw to monkey 6
  If false: throw to monkey 0`.split('\n'))
for(var monkey of monkeys) {
    modulos *= monkey.test // get the least common multiple of all tests
}
for(var i = 0; i < 10000; i++) {
    step()
}
console.log(monkeyBusiness())