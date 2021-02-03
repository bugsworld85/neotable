<template>
    <div class="neo-table">
        <div class="table-filter">
            <div class="row">
                <div class="col-md-6 flex middle">
                    <form
                        method="get"
                        ref="searchForm"
                        @submit.prevent
                        v-if="enableSearch"
                    >
                        <div class="input-group">
                            <input
                                type="text"
                                :placeholder="placeholder"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                class="form-control bg-light small search-field"
                                ref="searchField"
                                v-model="keyword"
                                @input="handleSearchTyping"
                                v-if="realTime"
                                size="38"
                            />
                            <input
                                type="text"
                                :placeholder="placeholder"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                class="form-control bg-light small search-field"
                                ref="searchField"
                                name="keyword"
                                v-model="searchedKeywordModel"
                                @input="handleSearchTyping"
                                v-else
                                size="38"
                            />
                            <div
                                class="input-group-append"
                                v-if="keyword !== null && keyword !== ''"
                            >
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    @click="handleClearSearch"
                                >
                                    <i class="fa fa-times fa-sm"></i>
                                </button>
                            </div>
                            <div
                                class="input-group-append"
                                v-else-if="realTime === false"
                            >
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    @click="handleSearchClick"
                                    v-if="
                                        isSearching &&
                                        searchedKeywordModel !== null &&
                                        searchedKeywordModel !== ''
                                    "
                                >
                                    <i class="fa fa-search fa-sm"></i>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    @click="handleClearSearch"
                                    v-if="
                                        searchedKeywordModel !== null &&
                                        searchedKeywordModel !== ''
                                    "
                                >
                                    <i class="fa fa-times fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div
            class="table-container"
            :style="{ maxHeight: maxHeight !== null ? maxHeight : 'initial' }"
        >
            <table class="table">
                <thead v-if="tableColumns.length > 0" class="sticky">
                    <tr>
                        <th
                            v-if="multipleRows"
                            width="10"
                            class="checkboxes"
                            :class="{
                                freeze: freezeColumn === 0,
                            }"
                        >
                            <div class="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="select-all"
                                    v-model="checkAll"
                                    @change="handleChangeAll"
                                />
                                <label
                                    class="custom-control-label"
                                    for="select-all"
                                ></label>
                            </div>
                        </th>
                        <th
                            v-for="(column, a) in tableColumns"
                            :key="`column-${getKey(column)}`"
                            :width="getWidth(column)"
                            :style="{
                                textAlign: isset(column.textAlign)
                                    ? column.textAlign
                                    : 'left',
                            }"
                            :class="{
                                'is-divider': getType(column) === 'divider',
                                freeze:
                                    freezeColumn === a ||
                                    (multipleRows && freezeColumn === a + 1),
                            }"
                        >
                            <button
                                @click="handleColumnSort(getKey(column))"
                                v-if="isSortable(column)"
                                type="button"
                            >
                                {{ getTitle(column) }}
                                <i
                                    class="fa fa-sort-up"
                                    v-if="
                                        currentColumn === getKey(column) && asc
                                    "
                                ></i>
                                <i
                                    class="fa fa-sort-down"
                                    v-else-if="
                                        currentColumn === getKey(column) && !asc
                                    "
                                ></i>
                                <i class="fa fa-sort" v-else></i>
                            </button>
                            <span v-else-if="getType(column) !== 'divider'">
                                {{ getTitle(column) }}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="loading || searching">
                    <tr>
                        <td :colspan="tableColumns.length + 1" v-if="loading">
                            {{ loadingMessage }}
                        </td>
                        <td :colspan="tableColumns.length + 1" v-else>
                            Searching
                            <code>{{ keyword }}</code
                            >...
                        </td>
                    </tr>
                </tbody>
                <tbody v-else-if="rows().length > 0" class="sticky">
                    <tr v-for="(row, i) in rows()" :key="`row-${i}`">
                        <td
                            v-if="multipleRows"
                            :class="{
                                freeze: freezeColumn === 0,
                            }"
                        >
                            <div class="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    :id="`row-${i}-col-select`"
                                    v-model="row.checked"
                                    @change="handleRowSelect($event, i)"
                                />
                                <label
                                    class="custom-control-label"
                                    :for="`row-${i}-col-select`"
                                ></label>
                            </div>
                        </td>
                        <td
                            v-for="(column, a) in tableColumns"
                            :key="`col-${getKey(column)}`"
                            :style="{
                                textAlign: isset(column.textAlign)
                                    ? column.textAlign
                                    : 'left',
                            }"
                            :class="{
                                'is-divider': getType(column) === 'divider',
                                freeze:
                                    freezeColumn === a ||
                                    (multipleRows && freezeColumn === a + 1),
                            }"
                        >
                            <input
                                type="text"
                                v-model="row[getKey(column)]"
                                v-if="getType(column) === 'text'"
                                readonly="readonly"
                                @dblclick="handleInputDoubleClick"
                                @blur="handleInputBlur"
                                @keyup="handleInputKeyup($event, column, row)"
                                @keydown="
                                    handleInputKeydown($event, column, row)
                                "
                                @change="handleInputChange($event, column, row)"
                                @input="handleInput($event, column, row)"
                            />
                            <!-- <textarea
                                rows="1"
                                class="form-control"
                                v-model="row[getKey(column)]"
                                v-else-if="getType(column) === 'textarea'"
                                readonly="readonly"
                                @dblclick="handleInputDoubleClick"
                                @blur="handleInputBlur"
                                @keyup="handleInputKeyup($event, column, row)"
                                @keydown="handleInputKeydown($event, column, row)"
                                @change="handleInputChange($event, column, row)"
                                @input="handleInput($event, column, row)"
                            ></textarea> -->
                            <input
                                size="5"
                                type="number"
                                v-model.number="row[getKey(column)]"
                                v-else-if="getType(column) === 'number'"
                                readonly="readonly"
                                @dblclick="handleInputDoubleClick"
                                @blur="handleInputBlur"
                                @keyup="handleInputKeyup($event, column, row)"
                                @keydown="
                                    handleInputKeydown($event, column, row)
                                "
                                @change="handleInputChange($event, column, row)"
                                @input="handleInput($event, column, row)"
                            />
                            <div
                                class="custom-control custom-switch"
                                v-else-if="getType(column) === 'switch'"
                            >
                                <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    v-model="row[getKey(column)]"
                                    :id="`row-${i}-col-${getKey(column)}`"
                                    @change="
                                        handleInputChange($event, column, row)
                                    "
                                />
                                <label
                                    class="custom-control-label"
                                    :for="`row-${i}-col-${getKey(column)}`"
                                ></label>
                            </div>
                            <div v-else-if="getType(column) === 'options'">
                                <select
                                    class="form-control"
                                    @change="
                                        handleSelectChange($event, row, column)
                                    "
                                    v-if="isset(column.options)"
                                >
                                    <option
                                        v-for="option in column.options"
                                        :key="`option-${i}-${option.value}`"
                                        :value="option.value"
                                        :selected="
                                            option.value === row[getKey(column)]
                                        "
                                    >
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>
                            <div
                                v-else-if="getType(column) === 'actions'"
                                class="flex"
                            >
                                <component
                                    v-for="(action, j) in column.actions"
                                    :key="`action-${row.id}-${j}`"
                                    :is="action"
                                    :column="column"
                                    :row="row"
                                    :index="i"
                                ></component>
                            </div>
                            <component
                                v-else-if="getType(column) === 'template'"
                                :is="column.template"
                                :column="column"
                                :row="row"
                                :value="row[getKey(column)]"
                                :index="i"
                            ></component>
                            <span
                                class="text-only clickable d-block"
                                role="button"
                                v-else-if="getType(column) === 'prompt'"
                                @click="handleClick($event, column, row)"
                                >{{
                                    isset(column.mutate)
                                        ? column.mutate(
                                              row[getKey(column)],
                                              row
                                          )
                                        : row[getKey(column)]
                                }}</span
                            >
                            <span
                                class="text-only"
                                v-else-if="isSearchable(column)"
                                v-html="
                                    $options.filters.highlight(
                                        isset(column.mutate)
                                            ? column.mutate(
                                                  row[getKey(column)],
                                                  row
                                              )
                                            : row[getKey(column)],
                                        keyword,
                                        $options._scopeId
                                    )
                                "
                                >{{
                                    isset(column.mutate)
                                        ? column.mutate(
                                              row[getKey(column)],
                                              row
                                          )
                                        : row[getKey(column)]
                                }}</span
                            >
                            <span
                                class="text-only"
                                v-else-if="getType(column) !== 'divider'"
                                >{{
                                    isset(column.mutate)
                                        ? column.mutate(
                                              row[getKey(column)],
                                              row
                                          )
                                        : row[getKey(column)]
                                }}</span
                            >
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td
                            :colspan="tableColumns.length + 1"
                            style="padding: 8px 10px; pointer-events: none"
                        >
                            {{ emptyMessage }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-footer">
            <div class="row">
                <div class="col-md-4">
                    <span
                        class="nowrap ml-2"
                        v-if="rows().length > 0 && !showAll"
                        >{{ start }}-{{ end }} of {{ totalRows }}</span
                    >
                </div>
                <div class="col-md-8 text-right" v-if="!showAll">
                    <nav aria-label="..." v-if="totalRows > limit">
                        <ul class="pagination mb-0 justify-content-end">
                            <li
                                class="page-item"
                                :class="{ disabled: currentPage <= 3 }"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    @click.prevent="
                                        handlePaginationClick($event, 1)
                                    "
                                    v-if="currentPage > 3"
                                >
                                    <i class="fa fa-angle-double-left"></i>
                                </a>
                                <span class="page-link" v-else>
                                    <i class="fa fa-angle-double-left"></i>
                                </span>
                            </li>
                            <li
                                class="page-item"
                                :class="{ disabled: currentPage === 1 }"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    @click.prevent="
                                        handlePaginationClick(
                                            $event,
                                            currentPage - 1
                                        )
                                    "
                                    v-if="currentPage > 1"
                                >
                                    <i class="fa fa-angle-left"></i>
                                </a>
                                <span class="page-link" v-else>
                                    <i class="fa fa-angle-left"></i>
                                </span>
                            </li>
                            <li
                                class="page-item"
                                v-for="page in maxPages"
                                :key="`pagination-${page.page}`"
                                :class="{ active: page.isCurrent }"
                            >
                                <span class="page-link" v-if="page.isCurrent">
                                    {{ page.page }}
                                    <span class="sr-only">(current)</span>
                                </span>
                                <a
                                    class="page-link"
                                    href="#"
                                    v-else
                                    @click.prevent="
                                        handlePaginationClick($event, page.page)
                                    "
                                    >{{ page.page }}</a
                                >
                            </li>
                            <li
                                class="page-item"
                                :class="{
                                    disabled: currentPage === totalPages,
                                }"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    @click.prevent="
                                        handlePaginationClick(
                                            $event,
                                            currentPage + 1
                                        )
                                    "
                                    v-if="currentPage < totalPages"
                                >
                                    <i class="fa fa-angle-right"></i>
                                </a>
                                <span class="page-link" v-else>
                                    <i class="fa fa-angle-right"></i>
                                </span>
                            </li>
                            <li
                                class="page-item"
                                :class="{
                                    disabled: currentPage > totalPages - 3,
                                }"
                            >
                                <a
                                    class="page-link"
                                    href="#"
                                    @click.prevent="
                                        handlePaginationClick(
                                            $event,
                                            totalPages
                                        )
                                    "
                                    v-if="currentPage <= totalPages - 3"
                                >
                                    <i class="fa fa-angle-double-right"></i>
                                </a>
                                <span class="page-link" v-else>
                                    <i class="fa fa-angle-double-right"></i>
                                </span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
// import "font-awesome/css/font-awesome.min.css";

var mixins = {
    methods: {
        isString(variable) {
            return typeof variable === "string";
        },
        isset(variable) {
            return typeof variable !== "undefined" && variable !== null;
        },
        isObject(variable) {
            return (
                variable instanceof Object && variable.constructor === Object
            );
        },
        moneyFormat(value = 0) {
            var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "Php",
            });

            return formatter.format(value);
        },
        search(value) {
            if (this.isset(value)) {
                return (
                    value
                        .toLowerCase()
                        .search(
                            this.keyword.replace(/\\|\//g, "").toLowerCase()
                        ) > -1
                );
            }
            return value;
        },
        isSearchable(column) {
            return this.isset(column.searchable) && column.searchable;
        },
        isMutate(column) {
            return this.isset(column.mutate);
        },
        isSortable(column) {
            return this.isset(column.sortable) && column.sortable;
        },
        columnToKey(column) {
            return column.toLowerCase().replace(/[^a-zA-Z0-9/-]/, "_");
        },
        getWidth(column) {
            return this.isset(column.width) ? column.width : false;
        },
        getType(column) {
            var allowed = [
                "string",
                "text",
                "number",
                "switch",
                // "textarea",
                "checkbox",
                "actions",
                "template",
                "options",
                "prompt",
                "divider",
            ];

            if (!this.isString(column)) {
                if (typeof column.type !== "undefined") {
                    if (allowed.includes(column.type)) {
                        return column.type;
                    }
                }
            }
            return "string";
        },
        getKey(column) {
            return this.isString(column)
                ? this.columnToKey(column)
                : column.key;
        },
        getTitle(column) {
            if (this.isString(column)) {
                return column
                    .toLowerCase()
                    .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase());
            }
            return this.isset(column.title) ? column.title : "";
        },
    },
};

export default {
    name: "neo-table",
    mixins: [mixins],
    filters: {
        highlight: (words, query, scopeId) => {
            var check = new RegExp(query, "ig");
            if (words === null) {
                return words;
            }
            return words.toString().replace(check, function (matched) {
                return `<span class="highlight" ${scopeId}>${matched}</span>`;
            });
        },
    },
    props: {
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
    },
    computed: {
        maxPages() {
            var pages = [];
            var start = 1;
            var limit = this.totalPages;

            if (this.currentPage > this.totalPages - 2) {
                start = this.totalPages - 4;
            } else if (this.currentPage < 3) {
                start = 1;
            } else if (this.currentPage >= 3) {
                start = this.currentPage - 2;
            }
            // if total pages is below 5, always start at 1
            if (this.totalPages < 5) {
                start = 1;
            }

            if (this.totalPages >= 5) {
                limit = 5;
            }

            for (let i = 0; i < limit; i++) {
                pages.push({
                    page: start + i,
                    isCurrent: this.currentPage === start + i,
                });
            }

            return pages;
        },
        start() {
            return (this.currentPage - 1) * this.limit + 1;
        },
        end() {
            var end = this.currentPage * this.limit;

            if (this.totalRows < this.limit) {
                return this.totalRows;
            }

            if (end > this.totalRows) {
                return this.totalRows;
            }
            return end;
        },
    },
    data() {
        return {
            checkAll: false,
            loading: true,
            tableColumns: this.columns,
            currentColumn: null,
            asc: true,
            columnMethods: {},
            keyword: null,
            searching: false,
            totalPages: Math.ceil(this.data.length / this.limit),
            currentPage: this.page,
            totalRows:
                this.totalTableRows > 0
                    ? this.totalTableRows
                    : this.data.length,
            oldInputValue: null,
            isSearching: false,
            searchedKeywordModel: this.searchedKeyword,
        };
    },
    created() {
        if (this.columns.length <= 0) {
            if (this.data.length > 0) {
                this.tableColumns = Object.keys(this.data[0]).filter((key) => {
                    return !this.exludeColumns.includes(key);
                });
            }
        }
        this.data.map((row) => {
            row.checked = false;

            return row;
        });

        this.asc = this.isAsc;
        if (this.isset(this.sortedColumn)) {
            this.sortedColumn = this.sortedColumn;
        }
    },
    mounted() {
        // console.log(this.columns);
        this.loading = false;

        // console.log(this.data);
    },
    methods: {
        handleClick(e, column = {}, row) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "message") &&
                {}.hasOwnProperty.call(column, "confirmed")
            ) {
                var value = prompt(
                    column.message,
                    this.isset(row[this.getKey(column)])
                        ? row[this.getKey(column)]
                        : ""
                );

                if (this.isset(value)) {
                    row[this.getKey(column)] = value;
                    column.confirmed(value, row);
                }
            }
        },
        handleSearchClick() {
            this.$refs.searchForm.submit();
        },
        handleSelectChange(e, row, column) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "change")
            ) {
                column.change(e, row, column);
            }
        },
        handlePaginationClick(e, page) {
            var currentPage = this.paginationClick(
                e,
                page,
                {
                    keyword: this.isset(this.searchedKeyword)
                        ? this.searchedKeyword
                        : this.keyword,
                    sortedColumn: this.isset(this.sortedColumn)
                        ? this.sortedColumn
                        : this.sortedColumn,
                    asc: this.asc,
                },
                this
            );

            if (this.isset(currentPage)) {
                this.currentPage = currentPage;
            }
        },
        handleClearSearch() {
            this.searching = false;
            this.keyword = null;
            this.currentPage = 1;
            this.isSearching = false;
            if (!this.realTime) {
                this.searchedKeywordModel = null;
                this.clearSearch();
            }
        },
        handleSearchTyping: _.debounce(function (e) {
            var keyword = this.searchCallback(e, this);

            if (this.isset(keyword) === false) {
                this.isSearching = true;
                return;
            }
            if (keyword !== "") {
                this.keyword = keyword;
            } else {
                this.handleClearSearch();
            }
            this.currentPage = 1;
        }, 500),
        handleInputChange(e, column, row) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "change") &&
                e.target.readOnly === false
            ) {
                column.change(e, row, column);
            }
        },
        handleInputKeydown: _.debounce(async function (e, column, row) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "keydown") &&
                e.target.readOnly === false &&
                e.location === 0
            ) {
                await column.keydown(e, row, column);
            }
        }, 500),
        handleInputKeyup: _.debounce(async function (e, column, row) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "keyup") &&
                e.target.readOnly === false &&
                e.location === 0
            ) {
                await column.keyup(e, row, column);
            }
        }, 500),
        handleInput: _.debounce(async function (e, column, row) {
            if (
                !this.isString(column) &&
                {}.hasOwnProperty.call(column, "input") &&
                e.target.readOnly === false
            ) {
                await column.input(e, row, column);
            }
        }, 500),
        handleInputBlur(e) {
            e.target.readOnly = true;
        },
        handleInputDoubleClick(e) {
            this.oldInputValue = e.target.value;
            e.target.readOnly = false;
        },
        handleRowSelect(e) {
            if (!e.target.checked) {
                this.checkAll = false;
            }
        },
        handleChangeAll(e) {
            this.checkAll = e.target.checked;

            for (let i = 0; i < this.data.length; i++) {
                this.data[i].checked = this.checkAll;
            }
        },
        handleColumnSort(key) {
            // if (!this.realTime) {
            //     window.location.href = Route.name("orders", null, null, {
            //         order_column: key,
            //         order_asc: !this.asc,
            //     });
            //     return;
            // }

            var column = this.columnSortCallback(
                key,
                key === this.sortedColumn ? !this.asc : true
            );

            if (this.isset(column) === false) {
                return;
            }

            if (column === this.sortedColumn) {
                this.asc = !this.asc;
            } else {
                this.asc = true;
            }
            this.sortedColumn = column;
        },
        rows() {
            var data = this.data.filter((row) => {
                if (this.keyword !== null) {
                    var found = false;
                    // get searchable columns
                    for (let i = 0; i < this.columns.length; i++) {
                        if (this.isSearchable(this.columns[i])) {
                            if (this.search(row[this.columns[i].key])) {
                                found = true;
                            }
                        }
                    }
                    return found;
                }
                return true;
            });

            if (this.sortedColumn !== null && this.realTime) {
                var sortKey = this.sortedColumn;

                this.columns.find((column) => {
                    if (
                        column.key === sortKey &&
                        column.sortable &&
                        this.isset(column.sortKey)
                    ) {
                        sortKey = column.sortKey;
                        return true;
                    }
                    return false;
                });

                // sort rows by column
                data.sort((a, b) => {
                    if (!isNaN(a[sortKey]) && !isNaN(b[sortKey])) {
                        if (a[sortKey] < b[sortKey]) {
                            return this.asc ? -1 : 1;
                        }
                        if (a[sortKey] > b[sortKey]) {
                            return this.asc ? 1 : -1;
                        }
                    } else if (
                        moment(a[sortKey]).isValid() &&
                        moment(b[sortKey]).isValid()
                    ) {
                        if (moment(a[sortKey]) - moment(b[sortKey]) > 0) {
                            return this.asc ? -1 : 1;
                        }
                        if (moment(a[sortKey]) - moment(b[sortKey]) < 0) {
                            return this.asc ? 1 : -1;
                        }
                    } else {
                        if (a[sortKey] < b[sortKey]) {
                            return this.asc ? -1 : 1;
                        }
                        if (a[sortKey] > b[sortKey]) {
                            return this.asc ? 1 : -1;
                        }
                    }

                    return 0;
                });
            }

            if (this.showAll) {
                return data;
            }

            var start = (this.currentPage - 1) * this.limit;
            var end = start + this.limit;

            if (this.keyword === null) {
                this.totalRows =
                    this.totalTableRows > 0
                        ? this.totalTableRows
                        : this.data.length;
                this.totalPages = Math.ceil(this.totalRows / this.limit);
            } else {
                this.totalRows = data.length;
                this.totalPages = Math.ceil(this.totalRows / this.limit);
            }

            if (data.length < start) {
                return data;
            } else {
                return data.slice(start, end);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.neo-table {
    position: relative;
}
.table-container {
    position: relative;
    overflow: auto;
    margin-bottom: 5px;
    border: 1px solid #dee2e6;
}
.pagination {
    .page-item.disabled,
    .page-item.active {
        pointer-events: none;
    }
}
.table-filter {
    margin-bottom: 5px;
    .form-control {
        background-color: white !important;
    }
}

.highlight {
    background-color: yellow !important;
    padding: 0;
    border-radius: 3px;
}

.fit-screen {
    height: 100vh;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    &.fs-1 {
        max-height: calc(100vh - 190px);
    }
    &.fs-2 {
        max-height: calc(100vh - 180px);
    }
}

.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.table {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    border-collapse: collapse;
    &.compact {
        tbody,
        thead {
            td,
            th,
            th:first-child,
            th:last-child {
                border-top: none;
                padding: 5px 10px;
            }
        }
    }
    thead {
        td,
        th,
        th:first-child {
            padding: 0;
            vertical-align: middle;
            white-space: nowrap;
        }
        td,
        th {
            position: relative;
            border-bottom: 2px solid #dee2e6;
            // .freeze {
            //     position: absolute;
            //     display: block;
            //     width: 100%;
            //     padding: 0;
            //     top: 0;
            // }
        }
        &.sticky {
            th,
            td {
                position: -webkit-sticky; /* for Safari */
                position: sticky;
                top: 0;
                background-color: #f9f9f9;
                z-index: 1;
                border-top: none;
            }
            th.freeze {
                left: 0;
                z-index: 2;
                box-shadow: 1px 0px 0 rgba(0, 0, 0, 0.1);
            }
        }
        th {
            button:hover {
                cursor: pointer;
            }
        }
    }
    tbody {
        td,
        th {
            white-space: nowrap;
        }
        &.sticky {
            th.freeze,
            td.freeze {
                position: -webkit-sticky; /* for Safari */
                position: sticky;
                left: 0;
                background-color: inherit;
                z-index: 1;
                border-left: none;
                box-shadow: 1px 0px 0 rgba(0, 0, 0, 0.1);
            }
        }
    }
    &.editable {
        tbody {
            td {
                border-top: none;
                padding: 0;
                .btn,
                .form-control {
                    margin: 3px 0;
                }
            }
        }
    }
}

.noevents {
    pointer-events: none;
}

.custom-switch {
    &:hover,
    > *:hover {
        cursor: pointer;
    }
}

.w-full {
    width: 100%;
}

.text-only {
    word-break: break-all;
    // white-space: nowrap;
}

table {
    .is-divider {
        border-right: 1px solid #dee2e6;
    }
    thead {
        th {
            padding: 0;
            vertical-align: middle;
            white-space: nowrap;
            button {
                border: none;
                background-color: transparent;
                display: block;
                outline: none;
                width: 100%;
                text-align: left;
                padding: 0.5em;
                text-align: inherit;
                i {
                    // float: right;
                    // transform: translate(-10px, calc(50% - 3px));
                    color: #aaa;
                }
                &:hover {
                    background-color: rgba(175, 175, 175, 0.3);
                }
            }
            &.checkboxes:first-child {
                padding: 0.5em 0.75rem;
            }
            span {
                padding: 0.5em;
                font-weight: normal;
            }
        }
    }
    tbody {
        tr {
            &:nth-child(even) {
                background-color: #e9ecf3;
            }
            &:nth-child(odd) {
                background-color: white;
            }
            &:hover {
                background-color: #bae3ef;
            }
        }
        td {
            padding: 0;
            vertical-align: middle;
            .btn {
                color: #888;
            }
            span {
                padding: 7px 5px;
                text-align: inherit;
                display: inline-block;
            }
            div {
                text-align: inherit;
            }
            input {
                &[type="text"] {
                    display: block;
                    width: 100%;
                }
                &[type="text"],
                &[type="number"] {
                    background-color: transparent;
                    border: 2px solid transparent;
                    padding: 4px 5px;
                    text-align: inherit;
                    cursor: pointer;
                    width: 100%;
                    &:focus {
                        outline: none;
                        cursor: pointer;
                    }
                    &:not([readonly]):focus {
                        background-color: white;
                        outline: 3px solid #bedef4;
                        cursor: default;
                        outline-color: #bedef4;
                        outline-width: 3px;
                    }
                }
            }
        }
    }
}
.custom-switch:hover,
.custom-checkbox:hover {
    label {
        cursor: pointer;
    }
}
</style>
