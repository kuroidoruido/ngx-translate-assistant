import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { TranslationState } from './translation.state';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        NgxsModule.forRoot([TranslationState]),
        NgxsReduxDevtoolsPluginModule.forRoot(),
    ],
})
export class StoreModule {}
