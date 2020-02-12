import axios from "axios"
import * as readline from "readline";
import { ResponseResult, Category, Config, Content } from "./types";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import * as path from "path";
import { promisify } from "util"
import { Log } from "./logger";

const logger = new Log("lib");

export async function GetCategory(auth: Config): Promise<ResponseResult<Category[]>> {
    return axios.get("https://pubcloud.ptpress.cn/pubcloud/content/front/ebookFolderTree", {
        params: {
            projectId: auth.projectId
        },
        headers: {
            "cookie": auth.cookie
        }
    }).then(response => {
        return response.data;
    });
}

export async function DownloadContent(auth: Config, folderId: string): Promise<ResponseResult<{ contents: Content[], folder: Category }>> {
    return axios.get("https://pubcloud.ptpress.cn/pubcloud/content/front/getContentsByFolderId", {
        params: {
            projectId: auth.projectId,
            folderId: folderId
        },
        headers: {
            "cookie": auth.cookie
        }
    }).then(response => {
        return response.data;
    });
}

export async function CreateDir(fullPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.mkdir(fullPath, {
            recursive: true
        }, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
export async function DownloadImage(baseDir: string, url: string): Promise<void> {
    try {
        const parsed = parseUrl(url);
        const fileDir = path.join(baseDir, path.dirname(parsed.pathname));
        await CreateDir(fileDir);
        logger.debug(`准备下载文件: ${url}`);
        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });
        await promisify(fs.writeFile)(path.join(baseDir, parsed.pathname), response.data, {
            encoding: "utf8"
        });
        logger.debug(`文件下载成功: ${url}`);
    } catch (ex) {
        logger.warn(`文件 ${url} 下载失败: `, ex.message);
    }
}
export async function DownloadImages(baseDir: string, urls: string[]): Promise<void> {
    await Promise.all(urls.map(u => DownloadImage(baseDir, u)));
}


export async function delay(time: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(function () {
            resolve();
        }, time);
    });
}

export async function question(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });

    return new Promise(resolve => {
        rl.question(query, answer => resolve(answer));
    });
}
