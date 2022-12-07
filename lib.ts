import * as fs from 'fs'
import path from 'path'

export function getTestCases(base: string): string[] {
    return fs.readFileSync(path.join(base, './input.txt'), 'utf8').split('\n')
}