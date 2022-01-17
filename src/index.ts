import { bootstrap } from "./bootstrap";
import { runtime } from "./runtime";

bootstrap()
    .then(runtime)
    .catch(reason => {
        console.error(reason);
        process.exit(1);
    });
