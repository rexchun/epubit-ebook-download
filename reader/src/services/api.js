export const BOOKS_ROOT_DIR = "/books/";
function getJSON(url) {
    return fetch(url, {
        method: "GET"
    }).then(data => data.json());
}

export function getBooksDir() {
    return getJSON("/api/books");
}

export function getBookCategoryTree(bookId) {
    return getJSON(`${BOOKS_ROOT_DIR}${bookId}/raw/categories.json`);
}
export function getChapterContent(bookId, contentId) {
    return getJSON(`${BOOKS_ROOT_DIR}${bookId}/raw/${contentId}.json`);
}

export function iterableTree(tree, callback) {
    if (!tree.children) {
        tree.children = [];
      }
      callback(tree);
      if (tree.children.length) {
        tree.children.forEach(t => iterableTree(t, callback));
      }
}