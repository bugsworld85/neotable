import NeoTable from "./NeoTable";
import NeoPaginator from "./components/Paginator";

export default {
    install(Vue) {
        Vue.component("neo-table", NeoTable);
        Vue.component("neo-paginator", NeoPaginator);
    },
    NeoTable: NeoTable,
    NeoPaginator: NeoPaginator,
};

// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(NeoTable);
// }

// export default NeoTable;
