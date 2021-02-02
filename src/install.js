import HelloWorld from "./components/HelloWorld";

const NeoTable = {
    install(Vue) {
        Vue.component("neo-table", HelloWorld);
    }
};

if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(NeoTable);
}

export default NeoTable;
