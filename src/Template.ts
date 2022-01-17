import { promises as fs } from "fs";
import * as Twig from "twig";
import * as path from "path";

export interface TemplateContext {
    [key: string]: unknown;
}

export class Template {

    private readonly filepath: string;

    public constructor(filepath: string) {
        this.filepath = path.resolve(__dirname, filepath);
    }

    public getName(): string {
        return path.basename(this.filepath)
            .replace(/\.dockerfile\.twig$/, "");
    }

    public async render(context: TemplateContext): Promise<string> {
        const content = await this.loadFile();

        const template = Twig.twig({
            data: content,
        });

        return template.renderAsync(context);
    }

    private async loadFile(): Promise<string> {
        return fs.readFile(this.filepath, 'utf8');
    }

}
