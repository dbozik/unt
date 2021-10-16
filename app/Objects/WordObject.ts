export class WordObject {
    public _id?: string;
    public word: string;
    public translation?: string;
    public level: number;
    public exampleSentence: string;
    public exampleSentenceTranslation?: string;
    public languageId: string;
    public userId: string;

    public constructor() {
    }
}
