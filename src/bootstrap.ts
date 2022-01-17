import { TemplateRegistry } from "./TemplateRegistry";
import { Template, TemplateContext } from "./Template";
import { RuntimeContext } from "./runtime";

export interface ImageConfiguration {
    sourceImage?: string;
    targetImage?: string;
    versions: string[];
    templates?: string[],
    variants: ImageVariant[],
    context?: TemplateContext;
}

export interface ImageVariant {
    sourceImage?: string;
    sourceTag: string;
    targetTag?: string;
    targetImage?: string;
    templates?: string[],
    context?: TemplateContext;
}

export async function bootstrap(): Promise<RuntimeContext> {
    const templateRegistry = new TemplateRegistry();

    templateRegistry.register("php", new Template('../templates/php.dockerfile.twig'));
    templateRegistry.register("caddy", new Template('../templates/caddy.dockerfile.twig'));

    const imageConfigurations: Record<string, ImageConfiguration> = {
        "php": {
            sourceImage: "php",
            targetImage: "chapterjason/php",
            versions: [
                "8.1",
            ],
            templates: [
                "php",
            ],
            variants: [
                { sourceTag: "{{VERSION}}-cli-alpine" },
                { sourceTag: "{{VERSION}}-fpm-alpine", context: { fpm: true } },
                {
                    sourceTag: "{{VERSION}}-cli-alpine",
                    targetTag: "{{VERSION}}-cli-node-alpine",
                    context: { node: true }
                },
                {
                    sourceTag: "{{VERSION}}-fpm-alpine",
                    targetTag: "{{VERSION}}-fpm-symfony-alpine",
                    context: { fpm: true, symfony: true }
                },
                {
                    sourceTag: "{{VERSION}}-fpm-alpine",
                    targetTag: "{{VERSION}}-webapp-alpine",
                    context: {
                        fpm: true,
                        symfony: true,
                        runtime_dependencies: [],
                        build_dependencies: ["postgresql-dev"],
                        php_extension_install: ["pdo", "pdo_pgsql"],
                        php_pecl_install: ["redis", "timezonedb"],
                        php_extension_enable: ["redis", "timezonedb"],
                    }
                },
            ],
        },
        "caddy": {
            sourceImage: "caddy",
            targetImage: "chapterjason/caddy",
            versions: [
                "2",
            ],
            templates: [
                "caddy",
            ],
            variants: [
                { sourceTag: "{{VERSION}}-builder-alpine" },
            ],
        },
    }

    return {
        templateRegistry,
        imageConfigurations,
    };
}
