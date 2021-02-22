import NeoTable from "./NeoTable";
import NeoPaginator from "./components/Paginator";
import NeoWindow from "./components/Window";

export default {
    install(Vue) {
        Vue.component("neo-table", NeoTable);
        Vue.component("neo-paginator", NeoPaginator);
        Vue.component("neo-window", NeoWindow);
    },
    NeoTable,
    NeoPaginator,
    NeoWindow,
};

// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(NeoTable);
// }

// export default NeoTable;
