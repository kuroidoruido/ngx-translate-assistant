import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
    ChangeTranslateKey,
    RemoveTranslateKey,
    AddTranslateKey,
    AddTranslateFile,
} from 'src/app/store/translation.actions';
import { TranslationState, TranslationStateModel, TranslationFilesInfo } from 'src/app/store/translation.state';

import { AddFileDialogComponent } from '../add-file-dialog/add-file-dialog.component';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    @Select(TranslationState) translationState$: Observable<TranslationStateModel>;

    newKeysForms: { [groupName: string]: FormGroup } = {};

    constructor(private store: Store, public dialog: MatDialog) {
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

    showCreateFile(groupName: string): void {
        this.translationState$.pipe(first()).subscribe((state) => {
            const oneFileFromGroup = state.filesInfo.find((f) => f.groupName === groupName).files[0];
            const indexOfPathSeparator = oneFileFromGroup.lastIndexOf('/');
            const file = indexOfPathSeparator === -1 ? '' : oneFileFromGroup.substring(0, indexOfPathSeparator);
            const dialogRef = this.dialog.open(AddFileDialogComponent, {
                width: '500px',
                data: { groupName, file },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                this.store.dispatch(new AddTranslateFile(groupName, result));
                }
            });
        });
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
