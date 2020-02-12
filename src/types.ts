export interface Config {
    cookie: string,
    projectId: string,
    BASE_DIR_RAW: string,
    BASE_DIR_HTML: string,
    BASE_DIR_RES: string
}
export interface Category {
    catalogPath: string,
    parentId: string,
    projectId: string,
    id: string,
    index: number,
    name: string,
    children: Category[]
}
export interface ResponseResult<T> {
    data: T,
    success: boolean
}
export interface Content {
    content: string,
    createDate: string,
    editingContent: string,
    id: string,
    index: number,
    projectId: string,
    resourceId: string,
    showUrls: ShowImage[],
    type: "singleImg" | "editor"
}
export interface ShowImage {
    outLink: string,
    showUrl: string,
    key: string
}