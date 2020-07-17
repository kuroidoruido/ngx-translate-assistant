const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');

const DATA = {
    filesInfo: [
        {
            baseKey: 'form-page',
            files: ['form-page.en.json', 'form-page.fr.json'],
        },
        {
            baseKey: 'about-page',
            files: ['about-page.en.json', 'about-page.fr.json'],
        },
    ],
    keys: {
        'form-page': {
            'form-page.header.title': {
                'form-page.en.json': 'My Form',
                'form-page.fr.json': 'Mon formulaire',
            },
            'form-page.header.sub-title': {
                'form-page.en.json': 'oh yeah!',
                'form-page.fr.json': 'Trop bien !',
            },
        },
        'about-page': {
            'about-page.header.title': {
                'about-page.en.json': 'About',
                'about-page.fr.json': 'A propos de',
            },
        },
    },
}

function startWebUi() {
    const app = new Koa();
    app.use(koaBody({ jsonLimit: '100kb' }));
    app.use(serve(__dirname+'/static'));
    app.use(async ctx => {
        if(ctx.path === '/api/translation-state') {
            if(ctx.request.method === 'GET') {
                ctx.body = DATA;
            } else if(ctx.request.method === 'PUT') {
                const body = ctx.request.body;
                console.log(body);
                ctx.status = 201;
            }
        }
    });
    app.listen(3578);
    console.log('Go to http://localhost:3578');
}

exports.startWebUi = startWebUi;