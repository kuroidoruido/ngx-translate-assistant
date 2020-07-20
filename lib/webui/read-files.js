var path      = require('path');
var fs        = require('fs');
const decache = require('decache');

function getTranslateState() {
    const configPath = path.join(process.cwd(), '.ngxtarc.json');
    if(!fs.existsSync(configPath)) {
        console.error('No config file found. You need to create .ngxtarc.json file.')
        process.exit(1);
    }
    const filesInfo = readFile(configPath);
    const keys = {};

    for(const fileInfo of filesInfo) {
        keys[fileInfo.groupName] = extractAndMergeKeys(fileInfo);
    }

    return { filesInfo, keys };
}

function extractAndMergeKeys({ files }) {
    const keys = {};
    for(const file of files) {
        const filePath = path.join(process.cwd(), file);
        if(!fs.existsSync(filePath)) {
            console.error(`The file "${filePath}" does not exists.`)
            process.exit(1);
        }
        const fileContent = readFile(filePath);
        const flattenFileContent = flattenObjectToKeyValue(fileContent);
        for(const [key, value] of Object.entries(flattenFileContent)) {
            if(typeof keys[key] === 'undefined') {
                keys[key] = {};
            }
            keys[key][file] = value;
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

function readFile(filePath) {
    const fileContent = require(filePath);
    decache(filePath);
    return fileContent;
}

exports.getTranslateState = getTranslateState;