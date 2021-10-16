import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output, ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TextPart } from '../../../app/Objects';
import { colorMaxLevel } from '../color.utils';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent implements OnChanges {

    @Input()
    public textPart: TextPart;

    @Output()
    public wordEdit: EventEmitter<TextPart> = new EventEmitter<TextPart>();
    @Output()
    public openTranslation: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('translationField')
    public translationField: ElementRef<HTMLInputElement>;

    public popupShowed: boolean = false;
    public translateForm: FormGroup;


    constructor(
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnChanges() {
        if (this.textPart) {
            this.popupShowed = false;
        }
    }


    public hasLineBreak(content: string): boolean {
        return content.includes('\n');
    }


    public clickPopup(): void {
        this.translateForm = new FormGroup({
            translation: new FormControl(this.textPart.translation),
            exampleSentence: new FormControl(this.textPart.exampleSentence),
            exampleSentenceTranslation: new FormControl(this.textPart.exampleSentenceTranslation),
        });
        this.openTranslation.emit(this.textPart.content);
        this.popupShowed = !this.popupShowed;
        this.changeDetection.detectChanges();
        this.translationField.nativeElement.focus();
        this.changeDetection.detectChanges();
    }


    public decreaseLevel(): void {
        this.textPart.level = this.textPart.level / 2;

        this.wordEdit.emit(this.textPart);
    }


    public increaseLevel(): void {
        if (this.textPart.level === 0) {
            this.textPart.level = 0.1;
        } else {
            this.textPart.level = this.textPart.level / 2 + colorMaxLevel / 2;
        }

        this.wordEdit.emit(this.textPart);
    }


    public setKnown(): void {
        this.textPart.level = colorMaxLevel;

        this.wordEdit.emit(this.textPart);
    }


    public updateTranslation(): void {
        this.textPart.translation = this.translateForm.get('translation').value;
        this.textPart.exampleSentence = this.translateForm.get('exampleSentence').value;
        this.textPart.exampleSentenceTranslation = this.translateForm.get('exampleSentenceTranslation').value;

        this.textPart.level = 0.1;

        this.wordEdit.emit(this.textPart);
    }
}
