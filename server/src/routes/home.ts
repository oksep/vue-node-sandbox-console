import Router from "koa-router";

const home = new Router();

export default home;

home.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
});
