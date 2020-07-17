import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ChangeTranslateKey } from 'src/app/store/translation.actions';
import { TranslationState, TranslationStateModel, TranslationFilesInfo } from 'src/app/store/translation.state';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    @Select(TranslationState) translationState$: Observable<TranslationStateModel>;

    constructor(private store: Store) {}

    onTranslateChange(baseKey: string, key: string, file: string, newValue: string): void {
        this.store.dispatch(new ChangeTranslateKey(baseKey, key, file, newValue));
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
