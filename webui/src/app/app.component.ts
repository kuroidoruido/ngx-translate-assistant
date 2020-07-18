import { Component } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { Store } from '@ngxs/store';
import { SaveTranslationState } from './store/translation.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(hotkeys: HotkeysService, store: Store) {
        hotkeys.addShortcut({ keys: 'meta.shift.s' }).subscribe(() => {
            store.dispatch(new SaveTranslationState());
        });
    }
}
