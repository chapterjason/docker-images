const images = {
    php: {
        from: "php",
        versions: [
            "8.1"
        ],
        tags: {
            "{{VERSION}}-cli-alpine": {
                tag: "{{VERSION}}-cli-alpine",
                templates: ["php", "composer"],
            },
            "{{VERSION}}-cli-node-alpine": {
                tag: "{{VERSION}}-cli-alpine",
                templates: ["php", "composer", "node"],
            },
            "{{VERSION}}-fpm-alpine": {
                tag: "{{VERSION}}-fpm-alpine",
                templates: ["php", "fpm", "composer"],
            },
            "{{VERSION}}-fpm-node-alpine": {
                tag: "{{VERSION}}-fpm-alpine",
                templates: ["php", "fpm", "composer", "node"],
            },
        },
    },
    "symfony-php": {
        from: "chapterjason/php",
        versions: [
            "8.1"
        ],
        tags: {
            "{{VERSION}}-fpm-alpine": {
                tag: "{{VERSION}}-fpm-alpine",
                templates: ["symfony"],
            },
            "{{VERSION}}-fpm-node-alpine": {
                tag: "{{VERSION}}-fpm-node-alpine",
                templates: ["symfony"],
            },
            "{{VERSION}}-cli-alpine": {
                tag: "{{VERSION}}-cli-alpine",
                templates: ["symfony"],
            },
            "{{VERSION}}-cli-node-alpine": {
                tag: "{{VERSION}}-cli-node-alpine",
                templates: ["symfony"],
            },
        },
    },
    "symfony-caddy": {
        from: "caddy",
        versions: [
            "2"
        ],
        tags: {
            "{{VERSION}}-builder-alpine": {
                tag: "{{VERSION}}-builder-alpine",
                templates: ["caddy-builder"],
            },
        }
    }
}

module.exports = {
    images,
};

