import Router from 'koa-router'
import Koa from "koa"
import executeCodeInSandbox from "../utils/sandbox";
import { getUserByEmail } from '../db/userDao';

export const sandboxRouter: Router = new Router()

sandboxRouter.post('execute-code', '/execute-code', async (ctx: Koa.Context) => {
    const { codeData } = ctx.request.body as { codeData?: string }
    let result: any
    console.log('sandbox exec start...\n', codeData)
    try {
        result = await executeCodeInSandbox({ ...sandboxEnv }, codeData)
        if (typeof result !== 'object') {
            result = `${result}`
        }
    } catch (e: any) {
        result = e.stack ? e.stack : `${e}`
        console.error('sandbox exec error', result)
    }
    console.log('sandbox exec end...\n', result)
    ctx.body = {
        result: result
    }
})

// modules which register in sandboxEnv, the code can reference only !!!
const sandboxEnv: any = {
    require,
    getUserByEmail
}
