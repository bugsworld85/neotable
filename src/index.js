import NeoTable from "./NeoTable";

export default {
    install(Vue) {
        Vue.component("neo-table", NeoTable);
    },
};

// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(NeoTable);
// }

// export default NeoTable;
