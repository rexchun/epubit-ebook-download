import { Config } from "./types";
import { question, CreateDir } from "./lib"

export const CONFIG: Config = {
    cookie: "",
    projectId: "",
    BASE_DIR_RAW: "",
    BASE_DIR_HTML: "",
    BASE_DIR_RES: ""
};

export async function init() {
    CONFIG.cookie = await question("请输入Cookie: ")
    CONFIG.projectId = await question("请输入书籍的 Project Id: ");

    const BASE_DIR = `books/${CONFIG.projectId}`;
    CONFIG.BASE_DIR_RAW = `${BASE_DIR}/raw`;
    CONFIG.BASE_DIR_HTML = `${BASE_DIR}/html`;
    CONFIG.BASE_DIR_RES = `${BASE_DIR}/res`;

    await CreateDir(CONFIG.BASE_DIR_RAW);
    await CreateDir(CONFIG.BASE_DIR_HTML);
    await CreateDir(CONFIG.BASE_DIR_RES);
}