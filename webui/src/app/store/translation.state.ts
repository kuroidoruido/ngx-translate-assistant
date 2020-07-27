import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { produce } from 'immer';
import { first } from 'rxjs/operators';

import {
    ChangeTranslateKey,
    LoadTranslationState,
    SaveTranslationState,
    RemoveTranslateKey,
    AddTranslateKey,
    AddTranslateFile,
    RenameTranslateKey,
    RemoveTranslateFile,
    RenameTranslateFile,
    AddTranslationGroup,
    RenameTranslationGroup,
    RemoveTranslationGroup,
} from './translation.actions';

export interface TranslationFilesInfo {
    groupName: string;
    baseKey?: string;
    files: string[];
}

export interface TranslationStateModel {
    filesInfo: TranslationFilesInfo[];
    keys: {
        [groupName: string]: {
            [key: string]: {
                [lang: string]: string;
            };
        };
    };
}

@State<TranslationStateModel>({
    name: 'translation',
    defaults: {
        filesInfo: [],
        keys: {},
    },
})
@Injectable()
export class TranslationState implements NgxsOnInit {
    constructor(private http: HttpClient) {}

    ngxsOnInit(ctx: StateContext<TranslationStateModel>): void {
        ctx.dispatch(new LoadTranslationState());
    }

    @Action(LoadTranslationState)
    onLoadTranslationState(ctx: StateContext<TranslationStateModel>): void {
        this.http.get<TranslationStateModel>('/api/translation-state').pipe(first()).subscribe(ctx.setState);
    }

    @Action(ChangeTranslateKey)
    onChangeTranslateKey(ctx: StateContext<TranslationStateModel>, action: ChangeTranslateKey): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                draft.keys[action.groupName][action.key][action.file] = action.newValue;
            })
        );
    }

    @Action(AddTranslateKey)
    onAddTranslateKey(ctx: StateContext<TranslationStateModel>, action: AddTranslateKey): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                draft.keys[action.groupName][action.key] = action.translations;
            })
        );
    }

    @Action(RenameTranslateKey)
    onRenameTranslateKey(ctx: StateContext<TranslationStateModel>, action: RenameTranslateKey): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                draft.keys[action.groupName][action.newKey] = draft.keys[action.groupName][action.oldKey];
                delete draft.keys[action.groupName][action.oldKey];
            })
        );
    }

    @Action(RemoveTranslateKey)
    onRemoveTranslateKey(ctx: StateContext<TranslationStateModel>, action: RemoveTranslateKey): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                delete draft.keys[action.groupName][action.key];
            })
        );
    }

    @Action(AddTranslateFile)
    onAddTranslateFile(ctx: StateContext<TranslationStateModel>, action: AddTranslateFile): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                for (const [key, values] of Object.entries(draft.keys[action.groupName])) {
                    values[action.file] = '';
                }
                draft.filesInfo.find((file) => file.groupName === action.groupName).files.push(action.file);
            })
        );
    }

    @Action(RenameTranslateFile)
    onRenameTranslateFile(ctx: StateContext<TranslationStateModel>, action: RenameTranslateFile): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                for (const [key, values] of Object.entries(draft.keys[action.groupName])) {
                    values[action.newFile] = values[action.oldFile];
                    delete values[action.oldFile];
                }
                const group = draft.filesInfo.find((fileInfo) => fileInfo.groupName === action.groupName);
                group.files = group.files.filter((file) => file !== action.oldFile);
                group.files.push(action.newFile);
            })
        );
    }

    @Action(RemoveTranslateFile)
    onRemoveTranslateFile(ctx: StateContext<TranslationStateModel>, action: RemoveTranslateFile): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                for (const [key, values] of Object.entries(draft.keys[action.groupName])) {
                    delete values[action.file];
                }
                const group = draft.filesInfo.find((fileInfo) => fileInfo.groupName === action.groupName);
                group.files = group.files.filter((file) => file !== action.file);
            })
        );
    }

    @Action(AddTranslationGroup)
    onAddTranslationGroup(ctx: StateContext<TranslationStateModel>, action: AddTranslationGroup): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                draft.filesInfo.push({
                    groupName: action.groupName,
                    files: [],
                });
                draft.keys[action.groupName] = {};
            })
        );
    }

    @Action(RenameTranslationGroup)
    onRenameTranslationGroup(ctx: StateContext<TranslationStateModel>, action: RenameTranslationGroup): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                const oldGroup = draft.filesInfo.find((fileInfo) => fileInfo.groupName === action.oldGroupName);
                oldGroup.groupName = action.newGroupName;
                draft.keys[action.newGroupName] = draft.keys[action.oldGroupName];
                delete draft.keys[action.oldGroupName];
            })
        );
    }

    @Action(RemoveTranslationGroup)
    onRemoveTranslationGroup(ctx: StateContext<TranslationStateModel>, action: RemoveTranslationGroup): void {
        ctx.setState(
            produce(ctx.getState(), (draft) => {
                draft.filesInfo = draft.filesInfo.filter((fileInfo) => fileInfo.groupName !== action.groupName);
                delete draft.keys[action.groupName];
            })
        );
    }

    @Action(SaveTranslationState)
    onSaveTranslationState(ctx: StateContext<TranslationStateModel>): void {
        this.http.put('/api/translation-state', ctx.getState()).pipe(first()).subscribe();
    }
}
