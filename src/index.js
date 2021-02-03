import NeoTable from "./NeoTable";
import NeoPaginator from "./Paginator";

export default {
    install(Vue) {
        Vue.component("neo-table", NeoTable);
        Vue.component("neo-paginator", NeoPaginator);
    },
    NeoTable,
    NeoPaginator,
};

// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(NeoTable);
// }

// export default NeoTable;
