export class LoadTranslationState {
    static readonly type = '[Translation] load state';
}

export class ChangeTranslateKey {
    static readonly type = '[Translation] change key';
    constructor(public baseKey: string, public key: string, public file: string, public newValue: string) {}
}

export class SaveTranslationState {
    static readonly type = '[Translation] save state';
}
