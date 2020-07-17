import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { FormComponent } from './form/form.component';

@NgModule({
    declarations: [FormComponent],
    imports: [CommonModule, MatExpansionModule, MatInputModule, MatTableModule],
    exports: [FormComponent],
})
export class FormModule {}
