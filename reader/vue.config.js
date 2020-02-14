module.exports = {
    publicPath: "/reader",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8002/',
                changeOrigin: true
            },
            '/books': {
                target: 'http://localhost:8002',
                changeOrigin: true
            }
        }
    }
};