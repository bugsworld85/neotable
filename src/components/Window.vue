<template>
    <div ref="window" class="window" v-if="show" :class="classes">
        <div class="header ns" @mousedown="onDrag" @dragstart="onDragStart">
            <span class="title" v-html="title">{{ title }}</span>
            <span class="controls">
                <!-- <button
                    type="button"
                    class="btn btn-default"
                    @click.prevent="onMinimize"
                >
                    <i>&#95;</i>
                    <i>&square;</i>
                </button> -->
                <button
                    type="button"
                    class="btn btn-default"
                    @click.prevent="handleOnClose"
                >
                    &#10005;
                </button>
            </span>
        </div>
        <div class="body col-md-12" :style="{ maxHeight }">
            <slot></slot>
        </div>
        <div class="footer text-right" v-if="hasFooterSlot && showFooter">
            <slot name="footer"></slot>
        </div>
        <div class="footer text-right" v-else-if="showFooter">
            <button
                type="button"
                class="btn btn-default"
                @click.prevent="handleOnClose"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="handleOnOkay"
            >
                Save
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "neo-window",
        props: {
            title: {
                type: String,
                default: "",
            },
            showFooter: {
                type: Boolean,
                default: true,
            },
            size: {
                type: String,
                default: "normal",
            },
            startLocation: {
                type: String,
                default: "top-right",
            },
            maxHeight: {
                type: String,
                default: "500px",
            },
        },
        data() {
            return {
                isLoading: false,
                show: false,
                isMinimized: false,
                isGrabbed: false,
            };
        },
        computed: {
            classes() {
                var location = this.startLocation;
                var classes = {
                    minimize: this.isMinimized,
                    grab: this.isGrabbed,
                    large: this.isLarge,
                    medium: this.isMedium,
                    normal: this.isNormal,
                    small: this.isSmall,
                };

                classes[location] = true;

                return classes;
            },
            isLarge() {
                return this.size === "large";
            },
            isMedium() {
                return this.size === "medium";
            },
            isNormal() {
                return this.size === "normal";
            },
            isSmall() {
                return this.size === "small";
            },
            hasFooterSlot() {
                return !!this.$slots["footer"];
            },
        },
        methods: {
            open() {
                this.show = true;
            },
            close() {
                this.show = false;
            },
            toggle() {
                this.show = !this.show;
            },
            handleOnOkay(e) {
                this.$emit("onokay", e, this.show);
                this.show = false;
            },
            handleOnClose(e) {
                this.$emit("onclose", e, this.show);
                this.show = false;
            },
            onMinimize(e) {
                this.isMinimized = !this.isMinimized;
                // let { window } = this.$refs;

                // if (window.classList.contains("minimize")) {
                // }

                // if ($(target).hasClass("minimize")) {
                //     $(target).css("top", "calc(100vh / 4)");
                //     $(target).removeClass("minimize");
                // } else {
                //     $(target).addClass("minimize");
                // }
            },
            onDrag(e) {
                setTimeout(() => {
                    let { window } = this.$refs;

                    let shiftX = e.clientX - window.offsetLeft;
                    let shiftY = e.clientY - window.offsetTop;
                    this.isGrabbed = true;

                    // centers the ball at (pageX, pageY) coordinates
                    function moveAt(pageX, pageY) {
                        window.style.left = pageX - shiftX + "px";
                        window.style.top = pageY - shiftY + "px";
                    }
                    function onMouseMove(e) {
                        moveAt(e.pageX, e.pageY);
                    }

                    // moveAt(e.pageX, e.pageY);

                    document.addEventListener("mousemove", onMouseMove);

                    document.onmouseup = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        window.onmouseup = null;
                        this.isGrabbed = false;
                    };
                    document.oncontextmenu = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        window.onmouseup = null;
                        this.isGrabbed = false;
                    };
                }, 10);
            },
            onDragStart(e) {
                e.preventDefault();
                return false;
            },
        },
    };
</script>

<style lang="scss" scoped>
.window {
    position: fixed;
    // top: calc(100% / 4);
    // right: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    border: 1px solid #dedede;
    border-radius: 5px;
    overflow: hidden;
    z-index: 9999;
    &.large {
        max-width: calc(100vw - 40px);
        width: 100%;
    }
    &.medium {
        max-width: 400px;
        width: 100%;
    }
    &.normal {
        max-width: 600px;
        width: 100%;
    }
    &.small {
        max-width: 250px;
        width: 100%;
    }
    &.top-right {
        top: 40px;
        right: 40px;
    }
    &.top-left {
        top: 40px;
        left: 40px;
    }
    &.bottom-right {
        bottom: 40px;
        right: 40px;
    }
    &.bottom-left {
        bottom: 40px;
        left: 40px;
    }
    .header {
        cursor: move;
        background-color: white;
        display: flex;
        .title {
            padding: 3px 5px;
            width: 100%;
            font-size: inherit;
        }
    }
    &.grab {
        .header {
            cursor: grabbing;
        }
    }
    .controls {
        display: block;
        width: auto;
        white-space: nowrap;
        button {
            display: inline-block;
            vertical-align: top;
            width: 29px;
            padding: 3px 5px;
            box-shadow: none;
            i {
                display: none;
                &:first-child {
                    display: block;
                }
            }
        }
    }
    &.minimize {
        bottom: 0 !important;
        top: initial !important;
        height: 30px;
        overflow: hidden;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        .controls {
            button {
                i {
                    &:first-child {
                        display: none;
                    }
                    &:last-child {
                        display: block;
                    }
                }
            }
        }
    }
    .body {
        padding-top: 10px;
        padding-bottom: 10px;
        position: relative;
        overflow-y: auto;
    }
    .footer {
        padding: 10px 15px;
    }
}
</style>