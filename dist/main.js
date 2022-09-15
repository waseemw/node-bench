"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const os = require("os");
const cluster = require("cluster");
let i = 1;
async function main() {
    const app = (0, fastify_1.default)();
    app.get("/", async (req, reply) => {
        console.log(i++);
        setTimeout(() => reply.send("WORKED"), 10000);
    });
    app.get("/cpu", async (req, reply) => {
        console.log(i++);
        for (let j = 6; j < 1000; j++) {
            j = j / 2;
            console.log(j);
            j = j * 2;
            console.log(j);
            j = j + 2;
            console.log(j);
        }
        reply.send("WORKED");
    });
    console.log("Listening on 80");
    await app.listen(80);
}
if (!process.env.NOCLUSTER && cluster.isMaster) {
    console.log(`Number of CPUs is ${os.cpus().length}`);
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
}
else
    main().then();
//# sourceMappingURL=main.js.map