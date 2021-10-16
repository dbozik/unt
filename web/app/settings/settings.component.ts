import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Language } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [LanguageService],
})
export class SettingsComponent implements OnInit {

    public languages: Language[] = [];
    public editingId: string = null;

    public languageForm: FormGroup;

    private NEW_LANGUAGE_ID: string = '001';

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly languageService: LanguageService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this.getLanguages();
    }


    /**
     * getLanguages
     */
    public getLanguages() {
        this.languageService.getLanguages().pipe(take(1)).subscribe((languages: Language[]) => {
            this.languages = languages;
            this.changeDetection.detectChanges();
        });
    }


    /**
     * add
     */
    public add(): void {
        const newLanguage: Language = {
            _id: this.NEW_LANGUAGE_ID,
            name: '',
            dictionary: 'https://translate.google.com/?sl=de&tl=en#de/en/{word}',
            wordSeparators: ' ,.?!;:_()[]/"\'-',
            sentenceSeparators: '.?!',
            userId: '',
        };

        this.languages.push(newLanguage);

        this.setupForm(newLanguage);

        this.editingId = this.NEW_LANGUAGE_ID;
    }


    /**
     * edit
     */
    public edit(languageId: string): void {
        const editingLanguage: Language = this.languages.find((language: Language) => language._id === languageId);

        this.setupForm(editingLanguage);
        this.editingId = languageId;
        this.changeDetection.detectChanges();
    }


    /**
     * save
     */
    public save(languageId: string): void {
        const language: Language = {
            name: this.languageForm.get('name').value,
            dictionary: this.languageForm.get('dictionary').value,
            wordSeparators: this.languageForm.get('wordSeparators').value,
            sentenceSeparators: this.languageForm.get('sentenceSeparators').value,
        };

        if (languageId === this.NEW_LANGUAGE_ID) {
            this.languageService.addLanguage(language).subscribe((data) => {
                this.getLanguages();
                this.editingId = null;
            });
        } else {
            this.languageService.editLanguage({...language, _id: languageId}).subscribe((data) => {
                this.getLanguages();
                this.editingId = null;
            });
        }
    }


    /**
     * remove
     */
    public remove(languageId: string) {
        this.languageService.deleteLanguage(languageId).subscribe(() => {
            this.getLanguages();
            this.editingId = null;
        });
    }


    /**
     * cancel
     */
    public cancel() {
        this.editingId = null;
        this.languages = this.languages.filter((language: Language) => language._id !== this.NEW_LANGUAGE_ID);
        this.changeDetection.detectChanges();
    }


    private setupForm(language: Language): void {
        this.languageForm = this.formBuilder.group({
            name: language.name,
            dictionary: language.dictionary,
            wordSeparators: language.wordSeparators,
            sentenceSeparators: language.sentenceSeparators,
        });
    }

}
