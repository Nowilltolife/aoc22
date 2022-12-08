import * as util from 'util'
import { getTestCases } from '../lib'

const FOLDER = 0
const FILE = 1

type filetype = 1 | 0

interface file {
    type: filetype,
    name: string,
    size: number,
    files?: {[key: string]: file}
}

var stack: file[] = []
var current: file = {
    type: FOLDER,
    name: '/',
    size: 0,
    files: {}
};
const root = current

function folder(name: string) {
    const file = current.files[name]
    if(!file) {
        current.files[name] = {type: FOLDER, name, size: 0, files: {}}
    }
}

function file(name: string, size: number) {
    const file = current.files[name]
    if(!file) {
        current.files[name] = {type: FILE, name, size, files: undefined}
    }
}

function cd(name: string) {
    if(name == '/') {
        current = root
        stack = []
        return
    }
    if(name == '..') {
        current = stack.pop()
        return
    }
    if(!current.files) return
    if(!current.files[name]) return
    stack.push(current)
    current = current.files[name]
}

function readInstructions(log: string[]) {
    for(var i = 0; i < log.length; i++) {
        var line = log[i]
        const split = line.split(' ')
        if(split[0] == '$') {
            const command = split[1]
            if(command.startsWith("cd")) {
                cd(split[2])
            }
        } else {
            if(split[0] == 'dir') {
                folder(split[1])
            } else {
                file(split[1], parseInt(split[0]))
            }
        }
    }
}

function getSize(start: file): number {
    if(start.type == FILE) return start.size
    var sum = 0
    for(const key of Object.keys(start.files)) {
        sum += getSize(start.files[key])
    }
    return sum
}

function getAllFolders(start: file): file[] {
    // get all folders in a flat array
    var folders: file[] = []
    if(start.type == FOLDER) {
        folders.push(start)
    }
    for(const key of Object.keys(start.files)) {
        const file = start.files[key]
        if(file.type == FOLDER) {
            folders = folders.concat(getAllFolders(file))
        }
    }
    return folders
}

function search(start: file, threshold: number): number {
    var sum = 0
    var folders = getAllFolders(start)
    for(var folder of folders) {
        const size = getSize(folder)
        if(size <= threshold) {
            sum += size
        }
    }

    return sum
}

function findFirstToDelete(start: file, totalSize: number, target: number): number {
    const totalUsed = getSize(start)
    const free = totalSize - totalUsed
    var folders = getAllFolders(start)
    const possible = []
    for(var folder of folders) {
        const size = getSize(folder)
        if(free + size >= target) {
            possible.push(size)
        }
    }
    // find the smallest item in list 
    var smallest = possible[0]
    for(var i = 1; i < possible.length; i++) {
        if(possible[i] < smallest) {
            smallest = possible[i]
        }
    }

    return smallest
}
//readInstructions(getTestCases(__dirname))
readInstructions(getTestCases(__dirname))

console.log(search(root, 100000))
console.log(findFirstToDelete(root, 70000000, 30000000))
