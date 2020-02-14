import { ResponseResult, Category, Content } from "./types";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util"
import { GetCategory, DownloadContent, delay, DownloadImages } from "./lib";
import { CONFIG, init } from "./config"
import { config as PkgConfig } from "../package.json"

(async function run() {
    if (PkgConfig.projectIds && PkgConfig.projectIds.length) {
        console.log("准备批量下载");
        PkgConfig.projectIds.reduce((prev, next) => {
            return prev.then(() => {
                return download(next);
            }).catch((error: any) => {
                console.warn("发生异常: ", error);
                return download(next);
            });
        }, Promise.resolve(undefined)).then(() => {
            console.log("批量下载完成");
        });
    } else {
        await download();
    }
})();

async function download(projectId?: string) {
    await init(projectId);
    console.log(`准备下载 ${projectId}`);

    const r1 = await GetCategory(CONFIG);
    promisify(fs.writeFile)(path.join(CONFIG.BASE_DIR_RAW, "categories.json"), JSON.stringify(r1));

    const firstPlaceholderCategory: Category = null;
    const promise = r1.data.reduce((prev, next) => {
        return prev.then(prevCategory => {
            CONFIG.logger.debug(`章节(${(prevCategory || {}).name}) > 下载完成\n`)
            CONFIG.logger.debug(`章节(${next.name}) > 准备下载`)
            return saveCategory(next).then(() => next);
        }).catch(() => {
            return saveCategory(next);
        });
    }, Promise.resolve(firstPlaceholderCategory));

    promise.then(() => {
        console.log(`${CONFIG.projectId} 下载完成`);
    });
    return promise;
}

async function saveCategory(category: Category) {
    CONFIG.logger.debug(`${category.name} > 准备下载`);
    const filePath = path.join(CONFIG.BASE_DIR_RAW, `${category.id}.json`);
    if (fs.existsSync(filePath)) {
        CONFIG.logger.debug(`${category.name} > 本地存在`);
    } else {
        const content = await DownloadContent(CONFIG, category.id);
        await saveToHtml(content)
        CONFIG.logger.debug(`${category.name} > 下载完成`);
        await promisify(fs.writeFile)(filePath, JSON.stringify(content));
        await delay(CONFIG.delay * 1000); //延迟3秒再执行下个章节下载, 防止过快请求站点屏蔽.
    }
    if (category.children && category.children.length) {
        for (let child of category.children) {
            await saveCategory(child);
        }
    }
}
async function saveToHtml(response: ResponseResult<{ contents: Content[], folder: Category }>): Promise<void> {
    let fileName = response.data.folder.name.replace(/[\/\?\*&!@#$]/g, "_");
    if (/^第\d+章 /.test(fileName)) {
        fileName = fileName.replace(/^第(\d+)章 (.+)/, "$1 第$1章 $2");
    }
    const filePath = path.join(CONFIG.BASE_DIR_HTML, `${fileName}.html`);
    let html = response.data.contents.map(content => {
        if (content.type === "singleImg") {
            return `<img src="../res/${content.editingContent}" style="width: 100%" />`
        }
        if (content.type === "editor") {
            return content.editingContent || content.content;
        }
        console.warn("invalid type: " + content.type);
        return `<p>invalid type: ${content.type}</p>`;
    }).join(`\n`);

    html += `\n\r\n<p class="epubit-contents-id" style="display: none">${JSON.stringify({ index: response.data.folder.index, parentId: response.data.folder.parentId, id: response.data.folder.id })}</p>`;

    const imageContents = response.data.contents.filter(content => content.showUrls && content.showUrls.length);
    for (let content of imageContents) {
        await DownloadImages(CONFIG.BASE_DIR_RES, content.showUrls.map(item => {
            if (item.showUrl.includes("?x-oss-process=image/watermark")) {
                return item.showUrl.split("?")[0];
            }
            return item.showUrl;
        }));
    };

    await promisify(fs.writeFile)(filePath, html, {
        encoding: "utf8"
    });
}