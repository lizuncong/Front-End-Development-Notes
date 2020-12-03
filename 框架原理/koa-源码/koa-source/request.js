module.exports = {

    get header() { // nodejs原生的headers对象
        return this.req.headers;
    },
    set header(val) {
        this.req.headers = val;
    },

    get url() { // nodejs原生的url
        return this.req.url;
    },

    set url(val) {
        this.req.url = val;
    },

    get method() {
        return this.req.method;
    },

    set method(val) {
        this.req.method = val;
    },

};
