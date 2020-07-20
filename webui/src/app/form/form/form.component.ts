import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ChangeTranslateKey, RemoveTranslateKey, AddTranslateKey } from 'src/app/store/translation.actions';
import { TranslationState, TranslationStateModel, TranslationFilesInfo } from 'src/app/store/translation.state';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    @Select(TranslationState) translationState$: Observable<TranslationStateModel>;

    newKeysForms: { [groupName: string]: FormGroup } = {};

    constructor(private store: Store) {
        this.translationState$.subscribe((state) => {
            this.newKeysForms = {};
            for (const fileInfo of state.filesInfo) {
                const translationControls = fileInfo.files
                    .map((file): [string, FormControl] => [file, new FormControl('')])
                    .reduce((acc, [file, control]) => ({ ...acc, [file]: control }), {});
                this.newKeysForms[fileInfo.groupName] = new FormGroup({
                    key: new FormControl(''),
                    translations: new FormGroup(translationControls),
                });
            }
        });
    }

    onTranslateChange(baseKey: string, key: string, file: string, newValue: string): void {
        this.store.dispatch(new ChangeTranslateKey(baseKey, key, file, newValue));
    }

    removeKey(groupName: string, key: string): void {
        this.store.dispatch(new RemoveTranslateKey(groupName, key));
    }

    addNewKey(groupName: string): boolean {
        const formState = this.newKeysForms[groupName].value;
        if (formState.key !== '') {
            this.store
                .dispatch(new AddTranslateKey(groupName, formState.key, { ...formState.translations }))
                .subscribe(() => this.newKeysForms[groupName].reset());
        }
        return false;
    }

    trackedByFilesInfo(fileInfo: TranslationFilesInfo): string {
        return fileInfo.baseKey;
    }

    trackedByKey(keyvalue: { key: string; value: string }): string {
        return keyvalue.key;
    }

    trackedByFile(file: string): string {
        return file;
    }
}
