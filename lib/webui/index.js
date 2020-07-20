const Koa     = require('koa');
const koaBody = require('koa-body');
const serve   = require('koa-static');

const { getTranslateState } = require('./read-files');
const { saveTranslationState } = require('./save-files');

function startWebUi() {
    const app = new Koa();
    app.use(koaBody({ jsonLimit: '100kb' }));
    app.use(serve(__dirname+'/static'));
    app.use(async ctx => {
        if(ctx.path === '/api/translation-state') {
            if(ctx.request.method === 'GET') {
                ctx.body = getTranslateState();
            } else if(ctx.request.method === 'PUT') {
                saveTranslationState(ctx.request.body);
                ctx.status = 201;
            }
        }
    });
    app.listen(3578);
    console.log('Go to http://localhost:3578');
}

exports.startWebUi = startWebUi;