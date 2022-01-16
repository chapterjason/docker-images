const {promises: fs, statSync} = require('fs');
const path = require("path");
const {images} = require("./config");

async function runtime() {
    const imageNames = Object.keys(images);
    const buildFile = path.resolve(__dirname, '.github/workflows/docker-build.yml');
    const publishFile = path.resolve(__dirname, '.github/workflows/docker-publish.yml');
    const contentsBuild = [`name: Build Docker Images

on:
    pull_request:

jobs:
    build:
        runs-on: ubuntu-20.04

        strategy:
            fail-fast: true
            matrix:
                include:`];

    const contentsPublish = [`name: Publish Docker Images

on:
  push:
  schedule:
    - cron: 0 0 * * 0

jobs:
    build:
        runs-on: ubuntu-20.04

        strategy:
            fail-fast: true
            matrix:
                include:`];

    for await (const imageName of imageNames) {
        const image = images[imageName];
        const {tags, versions} = image;
        const tagNames = Object.keys(tags);

        for await (const tagName of tagNames) {
            for await (const version of versions) {
                const {tag: fromTagName, templates: templateNames} = tags[tagName];
                const formattedTagName = tagName.replace(/{{VERSION}}/g, version);
                const directory = path.resolve(__dirname, `images/${imageName}/${formattedTagName}`);

                contentsBuild.push(`                    -   directory: "./${path.relative(__dirname, directory)}"
                        image: "chapterjason/${imageName}"
                        tag: "${formattedTagName}"`);
                contentsPublish.push(`                    -   directory: "./${path.relative(__dirname, directory)}"
                        image: "chapterjason/${imageName}"
                        tag: "${formattedTagName}"`);

            }
        }
    }

    contentsBuild.push(`        steps:
            -   uses: actions/checkout@v2
            
            -   name: Set up QEMU
                uses: docker/setup-qemu-action@v1

            -   name: Set up Docker Buildx
                uses: docker/setup-buildx-action@v1
            
            -   name: Extract metadata (tags, labels) for Docker
                id: meta
                uses: docker/metadata-action@v3
                with:
                    images: $\{{ matrix.image }}
                    tags: type=raw,value=$\{{ matrix.tag }}
            
            -   name: Build and push Docker images
                uses: docker/build-push-action@v2
                with:
                    context: $\{{ matrix.directory }}
                    tags: $\{{ steps.meta.outputs.tags }}
                    labels: $\{{ steps.meta.outputs.labels }}`)

    contentsPublish.push(`        steps:
            -   uses: actions/checkout@v2

            -   name: Set up QEMU
                uses: docker/setup-qemu-action@v1

            -   name: Set up Docker Buildx
                uses: docker/setup-buildx-action@v1

            -   name: Docker Login
                uses: docker/login-action@v1
                with:
                    username: $\{{ secrets.DOCKERHUB_USERNAME }}
                    password: $\{{ secrets.DOCKERHUB_TOKEN }}
                    
            -   name: Extract metadata (tags, labels) for Docker
                id: meta
                uses: docker/metadata-action@v3
                with:
                    images: $\{{ matrix.image }}
                    tags: type=raw,value=$\{{ matrix.tag }}
                    
            -   name: Build and push Docker images
                uses: docker/build-push-action@v2
                with:
                    platforms: linux/amd64,linux/arm64,linux/arm/v7
                    context: $\{{ matrix.directory }}
                    tags: $\{{ steps.meta.outputs.tags }}
                    labels: $\{{ steps.meta.outputs.labels }}
                    push: true`)

    await fs.writeFile(buildFile, contentsBuild.join('\n'));
    await fs.writeFile(publishFile, contentsPublish.join('\n'));
}

runtime()
    .catch(reason => {
        console.error(reason);
        process.exit(1);
    });

