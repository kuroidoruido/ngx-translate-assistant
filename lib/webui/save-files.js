var path = require('path');
var fs   = require('fs');

function saveTranslationState(state) {
    const files = rebuildFileFormat(state);
    for(const [filePath, fileContent] of Object.entries(files)) {
        const absoluteFilePath = path.join(process.cwd(), filePath);
        fs.writeFileSync(absoluteFilePath, JSON.stringify(fileContent, null, 2));
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

exports.saveTranslationState = saveTranslationState;