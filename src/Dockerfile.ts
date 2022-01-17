import { Stage } from "./Stage";
import { TemplateContext } from "./Template";
import { existsSync } from "fs";
import { promises as fs } from "fs";

export class Dockerfile {

    private stages: Stage[] = [];

    public stage(): Stage {
        const stage = new Stage();

        this.stages.push(stage);

        return stage;
    }

    public async build(context: TemplateContext) {
        const contents = [];
        const separator = "#".repeat(80);
        const textPrefix = "#".repeat(4);

        for await (const stage of this.stages) {
            const output = await stage.build(context);

            contents.push([
                separator,
                `${textPrefix} Begin stage`,
                `${textPrefix} ${stage.getTemplates().map(t => t.getName()).join(", ")}`,
                `${textPrefix} ${JSON.stringify(context)}`,
                separator,
                output.trim(),
            ].join("\n"));
        }

        return contents.join("\n\n");
    }

    public async dump(directory: string, context: TemplateContext) {
        if (!existsSync(directory)) {
            await fs.mkdir(directory, { recursive: true });
        }

        const contents = await this.build(context);

        await fs.writeFile(`${directory}/Dockerfile`, contents);
    }
}
