var path = require('path');
var fs   = require('fs');
const decache = require('decache');

const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');

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

function getTranslateState() {
    const configPath = path.join(process.cwd(), '.ngxtarc.json');
    if(!fs.existsSync(configPath)) {
        console.error('No config file found. You need to create .ngxtarc.json file.')
        process.exit(1);
    }
    const filesInfo = require(configPath);
    const keys = {};

    for(const fileInfo of filesInfo) {
        keys[fileInfo.baseKey] = extractAndMergeKeys(fileInfo.baseKey, fileInfo.files);
    }

    return { filesInfo, keys };
}

function extractAndMergeKeys(baseKey, files) {
    const keys = {};
    for(const file of files) {
        const filePath = path.join(process.cwd(), file);
        if(!fs.existsSync(filePath)) {
            console.error(`The file "${filePath}" does not exists.`)
            process.exit(1);
        }
        const fileContent = require(filePath);
        const flattenFileContent = flattenObjectToKeyValue(fileContent);
        for(const [key, value] of Object.entries(flattenFileContent)) {
            const finalKey = baseKey+'.'+key;
            if(typeof keys[finalKey] === 'undefined') {
                keys[finalKey] = {};
            }
            keys[finalKey][file] = value;
        }
    }
    return keys;
}

function flattenObjectToKeyValue(obj) {
    const map = {};
    for(const [key, value] of Object.entries(obj)) {
        if(typeof value === 'string') {
            map[key] = value;
        } else if(typeof value === 'object') {
            for(const [subkey,subvalue] of Object.entries(flattenObjectToKeyValue(value))) {
                map[key+'.'+subkey] = subvalue;
            }
        } else {
            console.warn(`Ignored key: ${key} because type of value is not string or object (${typeof value})`);
        }
    }
    return map;
}

function saveTranslationState(state) {
    const files = rebuildFileFormat(state);
    for(const [filePath, fileContent] of Object.entries(files)) {
        const absoluteFilePath = path.join(process.cwd(), filePath);
        fs.writeFileSync(absoluteFilePath, JSON.stringify(fileContent, null, 2));
        decache(absoluteFilePath);
    }
}

function rebuildFileFormat(state) {
    const files = {};
    for(const fileInfo of state.filesInfo) {
        for(const f of fileInfo.files) {
            files[f] = {};
        }
    }
    for(const [, keys] of Object.entries(state.keys)) {
        for(const [key, values] of Object.entries(keys)) {
            for(const [file, value] of Object.entries(values)) {
                patchFile(files, file, key, value);
            }
        }
    }
    return files;
}

function patchFile(files, file, key, value) {
    const keyPath = key.split('.');
    const lastKeyPathIndex = keyPath.length-1;
    let current = files[file];
    for(let i=1;i<keyPath.length;i++) {
        if(i === lastKeyPathIndex) {
            current[keyPath[i]] = value;
        } else {
            if(typeof current[keyPath[i]] === 'undefined') {
                current[keyPath[i]] = {};
            }
            current = current[keyPath[i]];
        }
    }
}

exports.startWebUi = startWebUi;