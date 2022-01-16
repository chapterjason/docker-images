const {promises: fs, statSync} = require('fs');
const path = require("path");
const {images} = require("./config");

function createImageArgs(name, image, tag) {
    name = name.toUpperCase();
    name = name.replace('-', '_');

    return `ARG ${name}_BASE_IMAGE_TAG=${tag}
ARG ${name}_BASE_IMAGE=${image}:$\{${name}_BASE_IMAGE_TAG}`;
}

async function getFiles(directory) {
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

async function getFilesFromBase(directory) {
    directory = path.resolve(__dirname, directory);

    const files = await getFiles(directory);

    return files.map(file => path.relative(directory, file));
}

async function runtime() {
    await fs.rm(path.resolve(__dirname, "images"), {recursive: true});

    const assetsDirectory = path.resolve(__dirname, "./assets");
    const assetFiles = await getFilesFromBase(assetsDirectory);

    const imageNames = Object.keys(images);

    for await (const imageName of imageNames) {
        const image = images[imageName];
        const {tags, from, versions} = image;
        const tagNames = Object.keys(tags);

        for await (const tagName of tagNames) {
            for await (const version of versions) {
                const {tag: fromTagName, templates: templateNames} = tags[tagName];
                const formattedTagName = tagName.replace(/{{VERSION}}/g, version);
                const formattedFromTagName = fromTagName.replace(/{{VERSION}}/g, version);

                const directory = path.resolve(__dirname, `images/${imageName}/${formattedTagName}`);

                await fs.mkdir(directory, {recursive: true});

                for await (const file of assetFiles) {
                    const source = path.resolve(assetsDirectory, file);
                    const target = path.resolve(directory, file);
                    const targetDirectory = path.dirname(target);

                    await fs.mkdir(targetDirectory, {recursive: true});
                    await fs.copyFile(source, target);
                }

                const file = `${directory}/Dockerfile`;
                const content = [
                    createImageArgs(imageName, from, formattedFromTagName),
                    `FROM $\{${imageName.toUpperCase().replace('-', '_')}_BASE_IMAGE}`
                ];

                for await (const templateName of templateNames) {
                    const template = await fs.readFile(`templates/${templateName}.template`, 'utf8');

                    content.push(template.trim());
                }

                await fs.writeFile(file, content.join('\n\n'));
            }
        }
    }

}

runtime()
    .catch(reason => {
        console.error(reason);
        process.exit(1);
    });
