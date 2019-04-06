export default class BaseIndexCardModel {
    public codeSnippetTitle: string;
    public codeSnippetText: string;
    public codeSnippetFileType: string;

    constructor(
      theCodeSnippetTitle: string,
      theCodeSnippetText: string,
      theCodeSnippetFileType: string,
    ) {
      this.codeSnippetTitle = theCodeSnippetTitle;
      this.codeSnippetText = theCodeSnippetText;
      this.codeSnippetFileType = theCodeSnippetFileType;
    }
}
