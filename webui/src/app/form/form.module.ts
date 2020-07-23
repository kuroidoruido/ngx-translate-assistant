import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

import { FormComponent } from './form/form.component';
import { AddFileDialogComponent } from './add-file-dialog/add-file-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [FormComponent, AddFileDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTableModule,
    ],
    exports: [FormComponent],
})
export class FormModule {}
