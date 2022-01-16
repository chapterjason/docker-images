const images = {
    php: {
        from: "php",
        versions: [
            "8.1"
        ],
        tags: {
            "{{VERSION}}-cli": {
                tag: "{{VERSION}}-cli",
                templates: ["php", "composer"],
            },
            "{{VERSION}}-cli-node": {
                tag: "{{VERSION}}-cli",
                templates: ["php", "composer", "node"],
            },
            "{{VERSION}}-fpm": {
                tag: "{{VERSION}}-fpm",
                templates: ["php", "fpm", "composer"],
            },
            "{{VERSION}}-fpm-node": {
                tag: "{{VERSION}}-fpm",
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
            "{{VERSION}}-fpm": {
                tag: "{{VERSION}}-fpm",
                templates: ["symfony"],
            },
            "{{VERSION}}-fpm-node": {
                tag: "{{VERSION}}-fpm-node",
                templates: ["symfony"],
            },
            "{{VERSION}}-cli": {
                tag: "{{VERSION}}-cli",
                templates: ["symfony"],
            },
            "{{VERSION}}-cli-node": {
                tag: "{{VERSION}}-cli-node",
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

