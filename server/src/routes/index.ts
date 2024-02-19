import Router from "koa-router";
import homeRouter from "./home";
import { sandboxRouter } from "./sandbox";

const router = new Router();

router.prefix('/api');
router.use('/sandbox', sandboxRouter.routes(), sandboxRouter.allowedMethods());
router.use('/home', homeRouter.routes(), homeRouter.allowedMethods());

router.get('/healcheck', async (ctx) => {
    ctx.body = {};
});

export default router;