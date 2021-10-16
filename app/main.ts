import { BrowserWindow, ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as Services from '../app/Services';
import * as Objects from '../app/Objects';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import { Routes } from '../web/shared/routes.enum';
import { Navigation } from './navigation';
import { LwtApp } from './lwt-app';

const PORT: number = 31411;

export default class Main {
    public static lwtApp: LwtApp;

    public static bindSendData<T>(eventName: ipcEvents, getData: () => Observable<T>) {
        ipcMain.on(eventName, (event, args) => {
            getData().pipe(take(1)).subscribe((data) => {
                event.sender.send(eventName + '-reply', data);
                event.sender.removeAllListeners(eventName + '-reply');
            });
        });
    }

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

        const languageService = new Services.LanguageService();

        Main.bindEvent<Objects.Text>(ipcEvents.ADD_TEXT, (new Services.TextService()).saveText);

        ipcMain.on('main-open-text', Main.openText);
        ipcMain.on(ipcEvents.LOGIN, Main.login);
        ipcMain.on(ipcEvents.SIGNUP, Main.signup);

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        languageService.bindDeleteLanguage();
    }


    private static openText(event, arg) {
        this.lwtApp.mainWindow.loadURL(`http://localhost:${PORT}/${Routes.READ_TEXT}/${arg}`);
    }

    private static login(event, arg) {
        const userService = new Services.UserService();
        userService.signin(arg.username, arg.password).subscribe((success: boolean) => {
            if (success) {
                (new Navigation()).openMenu();
                (new Navigation()).openPage(Routes.TEXTS);
            } else {
                this.lwtApp.mainWindow.webContents.send(ipcEvents.LOGIN_FAILED);
                ipcMain.emit(ipcEvents.LOGIN_FAILED);
            }
        }, (error) => console.dir(error));
    }

    private static signup(event, arg) {
        const userService = new Services.UserService();

        userService.signup(arg.username, arg.password, arg.email).subscribe((success: boolean) => {
            (new Navigation()).openPage(Routes.LOGIN);
        }, (error) => console.dir(error));
    }


    private static bindEvent<T>(eventName: ipcEvents, dbRequest: (arg: T) => Observable<T>): void {
        ipcMain.on(eventName, (event, arg: T) => {
            dbRequest(arg).subscribe((response: any) => {
                event.sender.send(eventName + '-reply', response);
            });
        });
    }
}
