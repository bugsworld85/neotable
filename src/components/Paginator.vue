<template>
    <div v-if="meta !== null" id="paginator">
        <div>
            <ul
                class="nostyle horizontal paginator"
                v-if="meta.total > meta.per_page"
            >
                <li
                    class="page-item"
                    v-bind:class="{ disabled: meta.current_page <= 3 }"
                >
                    <a
                        class="page-link p-first"
                        @click.prevent="handleClick(1)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-double-left"></i>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled: meta.last_page < 3 || meta.current_page === 1,
                    }"
                >
                    <a
                        class="page-link p-prev"
                        @click.prevent="handleClick(meta.current_page - 1)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-left"></i>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-for="i in limitPagination()"
                    :key="i + 4000"
                    v-bind:class="{ active: isCurrent(i) }"
                >
                    <a class="page-link" @click.prevent="handleClick(i)">{{
                        i
                    }}</a>
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled:
                            meta.last_page < 3 ||
                            meta.current_page === meta.last_page,
                    }"
                >
                    <a
                        class="page-link p-next"
                        @click.prevent="handleClick(meta.current_page + 1)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-right"></i>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled: meta.current_page > meta.last_page - 3,
                    }"
                >
                    <a
                        class="page-link p-last"
                        @click.prevent="handleClick(meta.last_page)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-double-right"></i>
                    </a>
                </li>
            </ul>
        </div>
        <span
            class="paginator-info"
            v-if="
                meta !== null &&
                typeof meta.total !== 'undefined' &&
                meta.total > 0
            "
        >
            {{
                `${moneyFormat(meta.from)}-${moneyFormat(
                    meta.to > meta.total ? meta.total : meta.to
                )} of ${moneyFormat(meta.total)} ${title}`
            }}
        </span>
    </div>
</template>

<script>
export default {
    name: "paginator",
    props: {
        title: {
            type: String,
            default: "rows",
        },
        meta: {
            type: Object,
            default: null,
        },
        callback: {
            type: Function,
            default: () => {},
        },
    },
    methods: {
        handleClick(page = 1) {
            this.callback(page);
        },
        limitPagination() {
            if (this.meta.last_page > 5) {
                if (
                    this.meta.current_page > 2 &&
                    this.meta.current_page < this.meta.last_page - 2
                ) {
                    return [
                        this.meta.current_page - 2,
                        this.meta.current_page - 1,
                        this.meta.current_page,
                        this.meta.current_page + 1,
                        this.meta.current_page + 2,
                    ];
                } else if (this.meta.last_page - 2 <= this.meta.current_page) {
                    return [
                        this.meta.last_page - 4,
                        this.meta.last_page - 3,
                        this.meta.last_page - 2,
                        this.meta.last_page - 1,
                        this.meta.last_page,
                    ];
                } else {
                    return [1, 2, 3, 4, 5];
                }
            } else {
                var arr = [];
                for (var i = 1; i <= this.meta.last_page; i++) {
                    arr.push(i);
                }
                return arr;
            }
        },
        isCurrent(i) {
            return i === this.meta.current_page;
        },
    },
};
</script>

<style lang="scss" scoped>
#paginator {
    display: flex;
    align-items: center;
    .paginator-info {
        width: auto;
        margin-left: 15px;
    }
}
.paginator {
    display: flex;
    align-items: center;
    padding: 0;
    list-style: none;
    margin: 0;
    .page-link:hover {
        cursor: pointer;
    }
    .page-item {
        margin-right: 0;
        .page-link {
            border-color: #ccc !important;
            color: #3f2171 !important;
        }
        &.disabled .page-link {
            background-color: #e8e8e8 !important;
            color: #bbb !important;
        }
        &.active {
            pointer-events: none;
            .page-link {
                background-color: #dc148a !important;
                color: white !important;
            }
        }
    }
}
</style>
