import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SaveTranslationState } from '../store/translation.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    constructor(private store: Store) {}

    save(): void {
        this.store.dispatch(new SaveTranslationState());
    }
}
