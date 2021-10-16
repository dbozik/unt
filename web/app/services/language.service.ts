import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../../../app/Objects/Language';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from '../add-text/ipc.service';

@Injectable()
export class LanguageService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }


    /**
     * getLanguages
     */
    public getLanguages(): Observable<Language[]> {
        return this.ipcService.getData<Language[]>(ipcEvents.LANGUAGES);
    }


    /**
     * addLanguage
     */
    public addLanguage(language: Language): Observable<Language> {
        return this.ipcService.sendData<Language>(ipcEvents.ADD_LANGUAGE, language);
    }


    /**
     * editLanguage
     */
    public editLanguage(language: Language): Observable<Language> {
        return this.ipcService.sendData<Language>(ipcEvents.EDIT_LANGUAGE, language);
    }


    public deleteLanguage(languageId: string): void {
        this.ipcService.ipc.send(ipcEvents.DELETE_LANGUAGE, languageId);
    }
}
