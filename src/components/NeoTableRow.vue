<template>
    <tr>
        <td
            v-for="(column, i) in headers"
            :key="`neo-table-row-${row[column].key}-${i}`"
        >
            {{ row[column].content }}
        </td>
    </tr>
</template>

<script>
export default {
    name: "neo-table-row",
    props: {
        row: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            headers: []
        };
    },
    mounted() {
        this.headers = Object.keys(this.row);
    }
};
</script>

<style lang="scss" scoped></style>
