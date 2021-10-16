import { Text, TextPart, WordObject } from '../Objects';

export class ParseTextService {
    private wordSeparatorsRegex: RegExp;
    private sentenceSeparatorsRegex: RegExp;

    public constructor(private wordSeparators: string, private sentenceSeparators: string) {
        this.wordSeparatorsRegex = new RegExp(`[\\n${wordSeparators.replace(']', '\\]')}]+`);
        this.sentenceSeparatorsRegex = new RegExp(`[\\n${sentenceSeparators.replace(']', '\\]')}]+`);
    }


    public splitToParts(text: string): TextPart[] {
        const justWords = this.splitToWordsCase(text);
        const textParts: TextPart[] = [];

        // iterate through words
        justWords.forEach(word => {
            // find the index of the first word
            const wordLength = word.length;
            const wordIndex = text.indexOf(word);

            // cut this part and push to textParts
            const beginPart = text.slice(0, wordIndex);
            textParts.push({
                content: beginPart,
                type: 'separator',
                wordId: '',
            });
            text = text.substr(wordIndex);

            // cut the first word and push to textParts
            textParts.push({
                content: word,
                type: 'word',
                wordId: ''
            });
            text = text.substr(wordLength);
        });

        // include the last part
        textParts.push({
            content: text,
            type: 'separator',
            wordId: ''
        });

        return textParts.filter(word => word.content !== '');
    }


    public extractWords(textParts: TextPart[]): string[] {
        return textParts.filter(textPart => textPart.type === 'word')
            .map(textPart => textPart.content.toLowerCase())
            .filter((word, index, list) => list.indexOf(word) === index);
    }


    public completeTextParts(textParts: TextPart[], wordObjects: WordObject[]): TextPart[] {
        const result: TextPart[] = JSON.parse(JSON.stringify(textParts));
        const wordObjectsMap = new Map();
        wordObjects.forEach(wordObject => wordObjectsMap.set(wordObject.word, wordObject));

        const textPartsWords = result.filter(textPart => textPart.type === 'word');

        textPartsWords.forEach(textPart => {
            const wordObject = wordObjectsMap.get(textPart.content.toLowerCase());

            if (wordObject) {
                textPart.wordId = wordObject._id;
                textPart.translation = wordObject.translation;
                textPart.level = wordObject.level;
                textPart.exampleSentence = wordObject.exampleSentence;
            } else {
                console.log(textPart.content);
            }
        });

        return result;
    }


    public getWords(text: Text, userId: string): WordObject[] {
        const wordObjects: WordObject[] = [];

        this.sentencesFromText(text).forEach(sentence => {
            this.wordsFromSentence(sentence).forEach(word => {
                wordObjects.push({
                    word: word.toLowerCase(),
                    exampleSentence: sentence,
                    languageId: text.languageId,
                    userId,
                    level: 0,
                });
            });
        });

        return this.uniqBy(wordObjects, 'word');
    }


    private splitToWordsCase(text: string): string[] {
        return text.split(this.wordSeparatorsRegex)
            .filter(word => word !== '');
    }


    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }


    private sentencesFromText(text: Text): string[] {
        return text.text.split(this.sentenceSeparatorsRegex)
            .filter(sentence => sentence !== '');
    }


    private wordsFromSentence(sentence: string): string[] {
        return sentence.split(this.wordSeparatorsRegex)
            .filter(word => word !== '')
            .map(word => word.toLowerCase());
    }
}
