import * as path from "path";
import { existsSync, promises as fs, statSync } from "fs";

export function renderTag(tag: string, version: string) {
    return tag.replace(/{{VERSION}}/g, version);
}

export function normalizeArg(arg: string) {
    return arg.toUpperCase().replace(/-/g, '_');
}

export async function getFiles(directory: string) {
    let items = await fs.readdir(directory);

    items = items.map(item => `${directory}/${item}`);

    const directories = items.filter(item => (statSync(item)).isDirectory());
    const files = items.filter(item => (statSync(item)).isFile());

    for await (const subDirectory of directories) {
        const subItems = await getFiles(subDirectory);

        files.push(...subItems);
    }

    return files;
}

export async function getFilesFromBase(directory: string) {
    directory = path.resolve(__dirname, directory);

    if (!existsSync(directory)) {
        return [];
    }

    const files = await getFiles(directory);

    return files.map(file => path.relative(directory, file));
}
