export class LoadTranslationState {
    static readonly type = '[Translation] load state';
}

export class ChangeTranslateKey {
    static readonly type = '[Translation] change key';
    constructor(public groupName: string, public key: string, public file: string, public newValue: string) {}
}

export class AddTranslateKey {
    static readonly type = '[Translation] add key';
    constructor(public groupName: string, public key: string, public translations: { [file: string]: string }) {}
}

export class RenameTranslateKey {
    static readonly type = '[Translation] rename key';
    constructor(public groupName: string, public oldKey: string, public newKey: string) {}
}

export class RemoveTranslateKey {
    static readonly type = '[Translation] remove key';
    constructor(public groupName: string, public key: string) {}
}

export class AddTranslateFile {
    static readonly type = '[Translation] add file';
    constructor(public groupName: string, public file: string) {}
}

export class RenameTranslateFile {
    static readonly type = '[Translation] rename file';
    constructor(public groupName: string, public oldFile: string, public newFile: string) {}
}

export class RemoveTranslateFile {
    static readonly type = '[Translation] remove file';
    constructor(public groupName: string, public file: string) {}
}

export class SaveTranslationState {
    static readonly type = '[Translation] save state';
}
