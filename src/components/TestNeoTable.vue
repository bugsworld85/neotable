<template>
    <div class="col-md-12">
        <neo-table
            :showAll="true"
            :data="products"
            :columns="columns"
            :multipleRows="false"
            :limit="25"
            maxHeight="600px"
            :freezeColumn="2"
            :enableSearch="false"
            sortedColumn="name"
        ></neo-table>
    </div>
</template>

<script>
import TestData from "../tests/data.js";
import NeoTable from "../NeoTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default {
    name: "TestNeoTable",
    props: {
        msg: String,
    },
    data() {
        return {
            products: TestData,
            columns: [
                {
                    key: "sku",
                    title: "SKU",
                    searchable: true,
                    sortable: true,
                    freeze: true,
                },
                {
                    key: "your_sku",
                    title: "Your SKU",
                    searchable: true,
                    sortable: true,
                },
                {
                    key: "name",
                    title: "Name",
                    searchable: true,
                    sortable: true,
                    freeze: true,
                },
                {
                    key: "brand_name",
                    title: "Brand",
                    searchable: true,
                    sortable: true,
                    freeze: true,
                },
                {
                    key: "barcode",
                    title: "Barcode",
                    searchable: true,
                },
                {
                    key: "case_size",
                    title: "Case Size",
                    sortable: true,
                },
                {
                    key: "cases_per_layer",
                    title: "Cases / Layer",
                    sortable: true,
                },
                {
                    key: "status",
                    title: "Status",
                    sortable: true,
                },
                {
                    key: "actions",
                    type: "actions",
                    textAlign: "right",
                    width: 10,
                    actions: [
                        window.Vue.component("view-product", {
                            template: `<a class="btn" :href="link"><i class="fa fa-edit"></i></a>`,
                            props: ["column", "row"],
                            computed: {
                                link() {
                                    return "";
                                },
                            },
                            methods: {
                                testClick() {
                                    console.log(this.column);
                                    console.log(this.row);
                                },
                            },
                        }),
                    ],
                },
            ],
        };
    },
    components: {
        NeoTable,
    },
    mounted() {
        console.log(this.products);
    },
    methods: {
        handlePaginationClick() {},
        remapRow(row) {
            console.log(row);
        },
    },
};
</script>

<style lang="scss" scoped></style>
