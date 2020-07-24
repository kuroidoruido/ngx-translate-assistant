import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    groupName: string;
    file: string;
}

@Component({
    selector: 'app-add-file-dialog',
    templateUrl: './add-file-dialog.component.html',
    styleUrls: ['./add-file-dialog.component.scss'],
})
export class AddFileDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AddFileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
