import { Template } from "./Template";

export class TemplateRegistry {

    private templates: Record<string, Template> = {};

    public register(name: string, template: Template): void {
        this.templates[name] = template;
    }

    public get(name: string): Template {
        if (!this.templates[name]) {
            throw new Error(`Template ${name} not found`);
        }

        return this.templates[name];
    }

    public has(name: string): boolean {
        return this.templates[name] !== undefined;
    }

    public resolve(names: string[]): Template[] {
        return names.map(name => this.get(name));
    }

}
