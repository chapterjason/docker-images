import { Template, TemplateContext } from "./Template";
import { normalizeArg } from "./Utils";

export class Stage {

    private from: string = "";

    private alias: string | null = null;

    private templates: Template[] = [];

    private args: Record<string, string> = {};

    public getArgs(): Record<string, string> {
        return this.args;
    }

    public setArgs(args: Record<string, string>): this {
        const keys = Object.keys(args);

        for (const key of keys) {
            this.setArg(key, args[key]);
        }

        return this;
    }

    public setArg(key: string, value: string = ""): this {
        this.args[normalizeArg(key)] = value;

        return this;
    }

    public getFrom(): string {
        return this.from;
    }

    public setFrom(from: string): this {
        this.from = from;

        return this;
    }

    public getAlias(): string | null {
        return this.alias;
    }

    public setAlias(alias: string | null): this {
        this.alias = alias;

        return this;
    }

    public getTemplates(): Template[] {
        return this.templates;
    }

    public setTemplates(templates: Template[]): this {
        this.templates = templates;

        return this;
    }

    public async build(context: TemplateContext): Promise<string> {
        const contents = [];
        const argNames = Object.keys(this.args);
        const args = [];

        for (const argName of argNames) {
            const arg = this.args[argName];

            args.push(`ARG ${argName}=${arg}`);
        }

        contents.push(args.join("\n"));

        if (this.alias !== null) {
            contents.push(`FROM ${this.from} AS ${this.alias}`);
        } else {
            contents.push(`FROM ${this.from}`);
        }

        for await (const template of this.templates) {
            const name = template.getName();
            const rendered = await template.render(context);

            contents.push([
                `### template begin: ${name}`,
                rendered.trim(),
                `### template end: ${name}`,
            ].join("\n"));
        }

        return contents.join("\n\n");
    }

}
