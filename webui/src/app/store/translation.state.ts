import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { produce } from 'immer';
import { first } from 'rxjs/operators';

import { ChangeTranslateKey, LoadTranslationState, SaveTranslationState } from './translation.actions';

export interface TranslationFilesInfo {
    baseKey: string;
    files: string[];
}

export interface TranslationStateModel {
    filesInfo: TranslationFilesInfo[];
    keys: {
        [baseKey: string]: {
            [key: string]: {
                [lang: string]: string;
            };
        };
    };
}

@State<TranslationStateModel>({
    name: 'translation',
    defaults: {
        filesInfo: [
            /*
            {
                baseKey: 'form-page',
                files: ['form-page.en.json', 'form-page.fr.json'],
            },
            {
                baseKey: 'about-page',
                files: ['about-page.en.json', 'about-page.fr.json'],
            },
            */
        ],
        keys: {
            /*
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
            */
        },
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
                draft.keys[action.baseKey][action.key][action.file] = action.newValue;
            })
        );
    }

    @Action(SaveTranslationState)
    onSaveTranslationState(ctx: StateContext<TranslationStateModel>): void {
        this.http.put('/api/translation-state', ctx.getState()).pipe(first()).subscribe();
    }
}
