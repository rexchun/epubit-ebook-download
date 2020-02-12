import { appendFile, existsSync, mkdirSync } from "fs";
import { join } from "path";
let GLOBAL_COUNT = 0;

export class Log {
    private dir: string
    constructor(private name: string) {
        this.dir = join(process.cwd(), "logs");
        this.checkDir();
    }
    checkDir() {
        if (!existsSync(this.dir)) {
            mkdirSync(this.dir, { recursive: true });
        }
    }
    private write(level: string, ...args: any[]): void {
        const filePath = join(this.dir, `${this.name}.${level}.log`);
        args.unshift(`[${GLOBAL_COUNT++} ${new Date().toLocaleString()}]`);
        args.push("\n");
        appendFile(filePath, args.join(" "), {
            encoding: "utf8"
        }, (err) => {
            if (err) {
                console.warn(`write file(${filePath}) failed: `, err);
                this.checkDir();
            }
        });
    }
    debug(...args: any[]): Log {
        this.write("debug", Array.from(arguments));
        return this;
    }
    warn(...args: any[]): Log {
        this.write("warn", Array.from(arguments));
        return this;
    }
    error(...args: any[]): Log {
        this.write("error", args);
        return this;
    }
}
export const Logger: Log = new Log("default");
