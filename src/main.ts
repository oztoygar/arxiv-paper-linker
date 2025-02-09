import { 
    App, 
    Editor,
    MarkdownView, 
    Modal, 
    Notice, 
    Plugin
} from 'obsidian';

interface ArxivPaper {
    id: string;
    title: string;
    authors: string[];
    published: string;
}

class ArxivSearchModal extends Modal {
    private papers: ArxivPaper[] = [];
    private selectedText: string;
    private onChoose: (paper: ArxivPaper) => void;

    constructor(app: App, searchText: string, onChoose: (paper: ArxivPaper) => void) {
        super(app);
        this.selectedText = searchText;
        this.onChoose = onChoose;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl("h2", { text: "Search arXiv Papers" });
        const loadingEl = contentEl.createEl("p", { text: "Searching..." });

        try {
            this.papers = await this.searchArxiv(this.selectedText);
            loadingEl.remove();

            if (this.papers.length === 0) {
                contentEl.createEl("p", { text: "No papers found." });
                return;
            }

            const listEl = contentEl.createEl("div", { cls: "arxiv-results" });
            
            this.papers.slice(0, 5).forEach((paper) => {
                const paperEl = listEl.createEl("div", {
                    cls: "arxiv-paper-item",
                });

                paperEl.createEl("h3", { text: paper.title });
                paperEl.createEl("p", { text: `Authors: ${paper.authors.join(", ")}` });
                paperEl.createEl("p", { text: `Published: ${paper.published}` });

                paperEl.addEventListener("click", () => {
                    this.onChoose(paper);
                    this.close();
                });
            });
        } catch (error) {
            loadingEl.remove();
            contentEl.createEl("p", { 
                text: "Error searching arXiv. Please try again." 
            });
        }
    }

    async searchArxiv(query: string): Promise<ArxivPaper[]> {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
            `http://export.arxiv.org/api/query?search_query=all:${encodedQuery}&start=0&max_results=5`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from arXiv');
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        return Array.from(entries).map(entry => ({
            id: entry.getElementsByTagName("id")[0].textContent?.split("/").pop() ?? "",
            title: entry.getElementsByTagName("title")[0].textContent?.trim() ?? "",
            authors: Array.from(entry.getElementsByTagName("author")).map(
                author => author.getElementsByTagName("name")[0].textContent ?? ""
            ),
            published: entry.getElementsByTagName("published")[0].textContent ?? ""
        }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export default class ArxivPaperLinkerPlugin extends Plugin {
    async onload() {
        // Add ribbon icon
        this.addRibbonIcon('search', 'Search arXiv', () => {
            new Notice('Select text first to search for papers');
        });

        // Add command
        this.addCommand({
            id: 'create-arxiv-link',
            name: 'Create arXiv Link from Selection',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const selection = editor.getSelection();
                if (!selection) {
                    new Notice('Please select some text first');
                    return;
                }

                new ArxivSearchModal(this.app, selection, (paper: ArxivPaper) => {
                    const arxivUrl = `https://arxiv.org/abs/${paper.id}`;
                    editor.replaceSelection(`[${selection}](${arxivUrl})`);
                    new Notice('arXiv link created!');
                }).open();
            }
        });
    }
}