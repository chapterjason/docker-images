import { TemplateRegistry } from "./TemplateRegistry";
import { ImageConfiguration } from "./bootstrap";
import { Dockerfile } from "./Dockerfile";
import { getFilesFromBase, normalizeArg, renderTag } from "./Utils";
import * as path from "path";
import { existsSync, promises as fs } from "fs";

export interface RuntimeContext {
    templateRegistry: TemplateRegistry;
    imageConfigurations: Record<string, ImageConfiguration>;
}

export async function runtime(context: RuntimeContext) {
    const imageNames = Object.keys(context.imageConfigurations);
    const rootDirectory = path.join(__dirname, "../");
    const baseDirectory = path.join(rootDirectory, "images");
    const assetsDirectory = path.resolve(rootDirectory, "assets");
    const assetFiles = await getFilesFromBase(assetsDirectory);
    const include = [];


    if(existsSync(baseDirectory)) {
        await fs.rm(baseDirectory, {recursive: true});
    }

    await fs.mkdir(baseDirectory);

    for await (const imageName of imageNames) {
        const imageConfiguration = context.imageConfigurations[imageName];

        for await (const version of imageConfiguration.versions) {
            for await (const variant of imageConfiguration.variants) {
                const dockerfile = new Dockerfile();
                const stage = dockerfile.stage();
                const targetTag = renderTag(variant.targetTag ?? variant.sourceTag, version);
                const targetImage = variant.targetImage ?? imageConfiguration.targetImage;
                const sourceTag = renderTag(variant.sourceTag, version);
                const targetDirectory = path.join(baseDirectory, imageName, targetTag);
                const sourceImageName = variant.sourceImage ?? imageConfiguration.sourceImage ?? null;
                const templates = context.templateRegistry.resolve(variant.templates ?? imageConfiguration.templates ?? []);

                if(!targetImage) {
                    throw new Error(`Target image is not defined for ${imageName} ${version} ${targetTag}`);
                }

                if (!sourceImageName) {
                    throw new Error(`No image name specified for ${imageName} ${version} ${targetTag}`);
                }

                if (!templates.length) {
                    throw new Error(`No templates found for ${imageName} ${version} ${targetTag}`);
                }

                stage
                    .setFrom(`$\{${normalizeArg(`${sourceImageName}_image`)}}`)
                    .setTemplates(templates)
                    .setArgs({
                        [`${sourceImageName}_tag`]: sourceTag,
                        [`${sourceImageName}_image`]: `${sourceImageName}:$\{${normalizeArg(`${sourceImageName}_tag`)}}`,
                    });

                await dockerfile.dump(targetDirectory, {
                    ...(variant.context ?? imageConfiguration.context ?? {}),
                });

                for await (const file of assetFiles) {
                    const source = path.resolve(assetsDirectory, file);
                    const target = path.resolve(targetDirectory, file);

                    await fs.mkdir(path.dirname(target), {recursive: true});
                    await fs.copyFile(source, target);
                }

                include.push({
                    directory: `./${path.relative(rootDirectory, targetDirectory)}`,
                    image: targetImage,
                    tag: targetTag,
                });
            }
        }
    }

    const matrix = {include};

    await fs.writeFile(path.join(rootDirectory, "matrix.json"), JSON.stringify(matrix));
}
