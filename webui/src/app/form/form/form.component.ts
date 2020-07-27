import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, ReplaySubject, combineLatest, of } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import {
    ChangeTranslateKey,
    RemoveTranslateKey,
    AddTranslateKey,
    AddTranslateFile,
    RenameTranslateKey,
    RemoveTranslateFile,
    RenameTranslateFile,
    AddTranslationGroup,
    RenameTranslationGroup,
    RemoveTranslationGroup,
} from 'src/app/store/translation.actions';
import { TranslationState, TranslationStateModel, TranslationFilesInfo } from 'src/app/store/translation.state';

import { AddFileDialogComponent } from '../add-file-dialog/add-file-dialog.component';
import produce from 'immer';

function toFilteredState(state: TranslationStateModel, search: string): TranslationStateModel {
    return produce(state, (draft) => {
        for (const [groupName, group] of Object.entries(draft.keys)) {
            for (const [key, values] of Object.entries(group)) {
                if (!key.toLocaleLowerCase().includes(search)) {
                    let valueMatch = false;
                    for (const [file, value] of Object.entries(values)) {
                        if ((value || '').toLocaleLowerCase().includes(search)) {
                            valueMatch = true;
                            break;
                        }
                    }
                    if (!valueMatch) {
                        delete draft.keys[groupName][key];
                    }
                }
            }
        }
    });
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    @Select(TranslationState) translationState$: Observable<TranslationStateModel>;

    search$ = new ReplaySubject<string>(1);
    filteredState$ = combineLatest([this.translationState$, this.search$.pipe(map((s) => s.toLocaleLowerCase()))]).pipe(
        map(([state, search]) => toFilteredState(state, search))
    );
    newKeysForms: { [groupName: string]: FormGroup } = {};
    isEditingGroupName: { [groupName: string]: boolean } = {};
    isEditingFile: { [file: string]: boolean } = {};
    isEditingKey: { [key: string]: boolean } = {};
    newGroupName = '';

    constructor(private store: Store, public dialog: MatDialog) {
        this.search$.next('');
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

    enableRenameKey(groupName: string, baseKey: string | undefined, key: string): void {
        this.isEditingKey[groupName + '.' + baseKey + '.' + key] = true;
    }

    disableRenameKey(groupName: string, baseKey: string | undefined, key: string): void {
        this.isEditingKey[groupName + '.' + baseKey + '.' + key] = false;
    }

    renameKey(groupName: string, baseKey: string, oldKey: string, newKey: string, event: KeyboardEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.store.dispatch(new RenameTranslateKey(groupName, oldKey, newKey));
        this.disableRenameKey(groupName, baseKey, oldKey);
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
            const oneFileFromGroup = state.filesInfo.find((f) => f.groupName === groupName).files[0] || '';
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

    enableRenameFile(groupName: string, file: string): void {
        this.isEditingFile[groupName + '.' + file] = true;
    }

    disableRenameFile(groupName: string, file: string): void {
        this.isEditingFile[groupName + '.' + file] = false;
    }

    renameFile(groupName: string, oldFile: string, newFile: string, event: KeyboardEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.store.dispatch(new RenameTranslateFile(groupName, oldFile, newFile));
        this.disableRenameFile(groupName, oldFile);
    }

    removeFile(groupName: string, file: string): void {
        this.store.dispatch(new RemoveTranslateFile(groupName, file));
    }

    createGroup(): void {
        this.store.dispatch(new AddTranslationGroup(this.newGroupName));
    }

    enableRenameGroup(groupName: string): void {
        this.isEditingGroupName[groupName] = true;
    }

    disableRenameGroup(groupName: string): void {
        this.isEditingGroupName[groupName] = false;
    }

    renameGroup(oldGroupName: string, newGroupName: string, event: KeyboardEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.store.dispatch(new RenameTranslationGroup(oldGroupName, newGroupName));
        this.disableRenameGroup(oldGroupName);
    }

    removeGroup(groupName: string): void {
        this.store.dispatch(new RemoveTranslationGroup(groupName));
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
