import { ResponseResult, Category, Content } from "./types";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util"
import { GetCategory, DownloadContent, delay, CreateDir, DownloadImages } from "./lib";
import { Log } from "./logger"
import { CONFIG, init } from "./config"


let logger = new Log(CONFIG.projectId);

(async function run() {
    await init();
    console.log("config: " + JSON.stringify(CONFIG));
    logger = new Log(CONFIG.projectId);

    const r1 = await GetCategory(CONFIG);
    promisify(fs.writeFile)(path.join(CONFIG.BASE_DIR_RAW, "categories.json"), JSON.stringify(r1));

    const firstPlaceholderCategory: Category = null;
    r1.data.reduce((prev, next) => {
        return prev.then(prevCategory => {
            logger.debug(`章节(${(prevCategory || {}).name}) > 下载完成`)
            logger.debug(`章节(${next.name}) > 准备下载`)
            return saveCategory(next).then(() => next);
        }).catch(() => {
            return saveCategory(next);
        });
    }, Promise.resolve(firstPlaceholderCategory));
})();


async function saveToHtml(response: ResponseResult<{ contents: Content[], folder: Category }>) {
    let fileName = response.data.folder.name.replace(/[\/\?\*&!@#$]/g, "_");
    if (/^第\d+章 /.test(fileName)) {
        fileName = fileName.replace(/^第(\d+)章 (.+)/, "$1 第$1章 $2");
    }
    const filePath = path.join(CONFIG.BASE_DIR_HTML, fileName + ".html");
    let html = response.data.contents.map(content => {
        if (content.type === "singleImg") {
            return `<img src="../res/${content.editingContent}" style="width: 100%" />`
        }
        if (content.type === "editor") {
            return content.editingContent || content.content;
        }
        console.warn("invalid type: " + content.type);
        return `<p>invalid type: ${content.type}</p>`;
    }).join(`<br class="split" />\n`);

    response.data.contents.filter(content => content.showUrls && content.showUrls.length).forEach(content => {
        DownloadImages(CONFIG.BASE_DIR_RES, content.showUrls.map(item => item.showUrl));
    });

    promisify(fs.writeFile)(filePath, html, {
        encoding: "utf8"
    });
}

async function saveCategory(category: Category) {
    logger.debug(`${category.name} > 准备下载`);
    const content = await DownloadContent(CONFIG, category.id);
    saveToHtml(content)
    logger.debug(`${category.name} > 下载完成`);
    await delay(3 * 1000);
    await promisify(fs.writeFile)(path.join(CONFIG.BASE_DIR_RAW, `${category.id}.json`), JSON.stringify(content));
    if (category.children && category.children.length) {
        for (let child of category.children) {
            await saveCategory(child);
        }
    }
}