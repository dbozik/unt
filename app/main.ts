import { BrowserWindow } from 'electron';
import { LwtApp } from './lwt-app';
import { Navigation } from './navigation';
import { ArchivedTextService, LanguageService, TextService, UserService, WordService } from './Services';

export default class Main {
    public static lwtApp: LwtApp;
    public static navigation: Navigation;

    static main(
        app: Electron.App,
        browserWindow: typeof BrowserWindow,
    ) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class1 has no dependencies.  This
        // makes the code easier to write tests for

        Main.lwtApp = new LwtApp(app, browserWindow);
        Main.lwtApp.init();

        Main.loadServices();
    }


    private static loadServices(): void {
        (new UserService()).init();
        (new TextService()).init();
        (new LanguageService()).init();
        (new WordService()).init();
        (new ArchivedTextService()).init();
    }
}
