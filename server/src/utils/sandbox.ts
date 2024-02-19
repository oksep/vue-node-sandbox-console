import vm, {Context, RunningScriptOptions, Script} from 'vm'
import {connectDBAsync, disconnectDBAsync} from '../db'

const globalConsole = global.console

const sandboxConsole = (level: string, msg: any, ...args: any[]) => {
    console.result += `${new Date().toLocaleString()} ${level}:\n${msg}`
    args.forEach(item => {
        if (typeof item !== 'object') {
            console.result += ` ${item}`
        } else {
            console.result += ` ${JSON.stringify(item)}`
        }
    })
    console.result += '\n\n'
}

const console: { result: string, log: Function, warn: Function, error: Function } = {
    result: '',
    log: (msg: any, ...args: any[]) => {
        globalConsole.log('Sandbox console', msg, ...args)
        sandboxConsole('debug', msg, ...args)
    },
    warn: (msg: any, ...args: any[]) => {
        globalConsole.warn('Sandbox console', msg, ...args)
        sandboxConsole('Warn', msg, ...args)
    },
    error: (msg: any, ...args: any[]) => {
        globalConsole.error('Sandbox console', msg, ...args)
        sandboxConsole('Erro', msg, ...args)
    },
}

// Do not modify this file anymore！！！
export default async function executeCodeInSandbox(sandbox: any, code?: string) {
    if (!code || code.trim().length === 0) {
        throw Error('Nothing executed.')
    }

    // assemble code
    const slices = code.trim().split(/\r?\n/)
        .map((l: string, i: number) => {
            return l.trimEnd()
        })
        .filter((l: string, i: number) => {
            return /^[A-Za-z0-9{}(&|]/.test(l.trimStart())
        })
    if (slices.length == 0) {
        throw Error('Nothing executed.')
    } else if (slices.length == 1) {
        code = slices[0]
    } else {
        code = slices.reduce((p: string, c: string, i: number, a: string[]) => {
            return `${p}\n    ${c}`
        })
    }

    // console.log("AAAAAAAAAA", code);

    // wrap code for safety
    let wrapCode = `globalConsole.log('VM exec in process:', process.pid, process.title)
try {
    console.result = ''
    await connectDBAsync()
    ${code}
    await disconnectDBAsync()
    inject(console.result)
} catch (e) {
    inject(e)
}`

    console.log(wrapCode);

    // 在 node:vm 中执行 code
    await (async (code: string) => {
        return new Promise((resolve) => {
            const script: Script = new vm.Script(`(async()=>{${code}})()`)
            const options: RunningScriptOptions = {
                timeout: 1000,
                displayErrors: true,
            }
            const context: Context = vm.createContext({
                ...sandbox,
                console,
                globalConsole,
                process,
                connectDBAsync,
                disconnectDBAsync,
                inject: (result: any) => {
                    sandbox.result = result
                    resolve(result)
                }
            })
            script.runInContext(context, options)
        })
    })(wrapCode)

    return sandbox.result // util.inspect(sandbox.result)
}