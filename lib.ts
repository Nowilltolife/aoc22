import * as fs from 'fs'
import path from 'path'

export function getTestCases(base: string): string[] {
    return fs.readFileSync(path.join(base, './input.txt'), 'utf8').split('\n')
}

export function extractAfter(input: string, spliterator: string): string {
    return input.substring(input.indexOf(spliterator) + spliterator.length)
}