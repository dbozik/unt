import { database } from './database';
import { ReplaySubject, Observable } from 'rxjs';
import { Language } from '../Objects/Language';

export class languages {
    private db: database = new database();

    public constructor() { }

    public addLanguage(name: string, dictionary: string, userId: string, wordSeparators: string,
        sentenceSeparators: string)
        : Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

        this.db.languages.insert(
            {
                userId: userId, name: name, dictionary: dictionary,
                wordSeparators: wordSeparators.toString(),
                sentenceSeparators: sentenceSeparators.toString()
            },
            (error, dbLanguage: any) => {
                const language: Language = {
                    _id: dbLanguage._id,
                    name: dbLanguage.name,
                    dictionary: dbLanguage.dictionary,
                    wordSeparators: new RegExp(dbLanguage.wordSeparators),
                    sentenceSeparators: new RegExp(dbLanguage.sentenceSeparators),
                    userId: dbLanguage.userId,
                };

                languageSource$.next(language);
            });

        return languageSource$.asObservable();
    }

    public get(languageId: string): Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

        this.db.languages.findOne({ _id: languageId }, (error, language: Language) => {
            languageSource$.next(language);
        });

        return languageSource$.asObservable();
    }

    public getList(userId: string): Observable<Language[]> {
        const languageSource$: ReplaySubject<Language[]> = new ReplaySubject(1);

        this.db.languages.find({userId}, (error, languages: Language[]) => {
            languageSource$.next(languages);
        });

        return languageSource$.asObservable();
    }
}