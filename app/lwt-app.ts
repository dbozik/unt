import { BrowserWindow, App } from "electron";
import { Navigation } from "./navigation";
import { Routes } from "../web/shared/routes.enum";

export class LwtApp {
    private navigation: Navigation;
    private mainWindow: BrowserWindow;

    constructor(
        public app: App,
        public browserWindow: typeof BrowserWindow,
    ) {
    }


    public init() {
        this.navigation = new Navigation();

        this.app.on('window-all-closed', this.onWindowAllClosed);
        this.app.on('ready', this.onReady);
        this.app.on('activate', this.onReady);
    }


    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            this.app.quit();
        }
    }

    private onClose() {
        // Dereference the window object.
        this.mainWindow = null;
    }

    private onReady() {
        this.navigation.closeMenu();

        this.mainWindow = new this.browserWindow({ width: 1500, height: 927 });

        const environment: 'dev' | 'prod' = 'dev';

        this.mainWindow.loadFile('./dist/web/index.html');
        this.navigation.openPage(Routes.LOGIN);
        // if (environment === 'dev') {
        //     Main.mainWindow.loadURL(`http://localhost:${PORT}`);
        // } else {
        //     Main.mainWindow.loadFile('./dist/web/index.html');
        // }

        this.mainWindow.webContents.openDevTools();

        this.mainWindow.on('closed', this.onClose);
    }
}