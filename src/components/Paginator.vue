<template>
    <div v-if="meta !== null" id="paginator">
        <div>
            <ul class="nostyle horizontal paginator" v-if="total > per_page">
                <li
                    class="page-item"
                    v-bind:class="{ disabled: current_page <= 3 }"
                >
                    <a
                        class="page-link p-first"
                        @click.prevent="handleClick($event, 1)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-double-left"></i>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled: last_page < 3 || current_page === 1,
                    }"
                >
                    <a
                        class="page-link p-prev"
                        @click.prevent="handleClick($event, current_page - 1)"
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
                    <a
                        class="page-link"
                        @click.prevent="handleClick($event, i)"
                        >{{ i }}</a
                    >
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled: last_page < 3 || current_page === last_page,
                    }"
                >
                    <a
                        class="page-link p-next"
                        @click.prevent="handleClick($event, current_page + 1)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-right"></i>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-bind:class="{
                        disabled: current_page > last_page - 3,
                    }"
                >
                    <a
                        class="page-link p-last"
                        @click.prevent="handleClick($event, last_page)"
                        tabindex="-1"
                    >
                        <i class="fa fa-angle-double-right"></i>
                    </a>
                </li>
            </ul>
        </div>
        <span
            class="paginator-info"
            v-if="meta !== null && typeof total !== 'undefined' && total > 0"
        >
            {{
                `${moneyFormat(from)}-${moneyFormat(
                    to > total ? total : to
                )} of ${moneyFormat(total)} ${title}`
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
        current_page: {
            type: Number,
            default: 0,
        },
        last_page: {
            type: Number,
            default: 0,
        },
        per_page: {
            type: Number,
            default: 10,
        },
        total: {
            type: Number,
            default: 0,
        },
        to: {
            type: Number,
            default: 0,
        },
        from: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        handleClick(e, page = 1) {
            this.$emit("click", page, e);
        },
        limitPagination() {
            if (this.last_page > 5) {
                if (
                    this.current_page > 2 &&
                    this.current_page < this.last_page - 2
                ) {
                    return [
                        this.current_page - 2,
                        this.current_page - 1,
                        this.current_page,
                        this.current_page + 1,
                        this.current_page + 2,
                    ];
                } else if (this.last_page - 2 <= this.current_page) {
                    return [
                        this.last_page - 4,
                        this.last_page - 3,
                        this.last_page - 2,
                        this.last_page - 1,
                        this.last_page,
                    ];
                } else {
                    return [1, 2, 3, 4, 5];
                }
            } else {
                var arr = [];
                for (var i = 1; i <= this.last_page; i++) {
                    arr.push(i);
                }
                return arr;
            }
        },
        isCurrent(i) {
            return i === this.current_page;
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
