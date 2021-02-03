module.exports = {
    showAll: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: "Search for...",
    },
    clearSearch: {
        type: Function,
        default: () => {},
    },
    totalTableRows: {
        type: Number,
        default: 0,
    },
    realTime: {
        type: Boolean,
        default: true,
    },
    searchedKeyword: {
        type: String,
        default: null,
    },
    isAsc: {
        type: Boolean,
        default: true,
    },
    sortedColumn: {
        type: String,
        default: null,
    },
    page: {
        type: Number,
        default: 1,
    },
    limit: {
        type: Number,
        default: 15,
    },
    searchCallback: {
        type: Function,
        default: (e) => {
            return e.target.value;
        },
    },
    paginationClick: {
        type: Function,
        default: (e, page) => {
            return page;
        },
    },
    columnSortCallback: {
        type: Function,
        default: (key) => {
            return key;
        },
    },
    enableSearch: {
        type: Boolean,
        default: true,
    },
    multipleRows: {
        type: Boolean,
        default: true,
    },
    exludeColumns: {
        type: Array,
        default: () => [],
    },
    loadingMessage: {
        type: String,
        default: "Loading...",
    },
    emptyMessage: {
        type: String,
        default: "No data available.",
    },
    columns: {
        type: Array,
        default: () => [],
    },
    data: {
        type: Array,
        default: () => [],
    },
    freezeColumn: {
        type: Number,
        default: 0,
    },
    maxHeight: {
        type: String,
        default: null,
    },
};
