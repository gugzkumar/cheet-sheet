export default class BaseIndexCardModel {
    public uniqueId: string;
    public codeSnippetTitle: string;
    public codeSnippetText: string;
    public codeSnippetFileType: string;

    constructor(
      theUniqueId: string,
      theCodeSnippetTitle: string,
      theCodeSnippetText: string,
      theCodeSnippetFileType: string,
    ) {
      this.uniqueId = theUniqueId;
      this.codeSnippetTitle = theCodeSnippetTitle;
      this.codeSnippetText = theCodeSnippetText;
      this.codeSnippetFileType = theCodeSnippetFileType;
    }
}
