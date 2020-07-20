import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { FormComponent } from './form/form.component';

@NgModule({
    declarations: [FormComponent],
    imports: [CommonModule, MatButtonModule, MatExpansionModule, MatIconModule, MatInputModule, MatTableModule],
    exports: [FormComponent],
})
export class FormModule {}
