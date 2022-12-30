<template>
  <div class="custom-accordion" id="dropdown">
    <div
      class="accordion-button button"
      :style="isExpanded ? 'background-color: #ffe2d8' : ''"
      @click="isExpanded = !isExpanded"
    >
      <span
        :style="
          isExpanded ? '-webkit-filter: invert(100%);filter: invert(100%);' : ''
        "
        class="accordion-heading"
      >
        Showing <span class="showX">${showX}$</span>
      </span>
      <svg
        class="header-icon"
        :class="{ rotate: isExpanded }"
        :style="isExpanded ? 'color: auto' : ''"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
    <Transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="accordion-item-details row" v-show="isExpanded">
        <span @click.stop="newX(20)">20</span>
        <span @click.stop="newX(50)">50</span>
        <span @click.stop="newX(100)">100</span>
      </div>
    </Transition>
  </div>
</template>


<script>
import { ref } from "vue";
export default {
  props: {
    showX: {
      type: Number,
      required: true,
    },
  },
  emits: ["inFocus", "showX"],
  setup(props, { emit }) {
    function newX(i) {
      isExpanded.value = false;
      emit("showX", i);
    }
    const isExpanded = ref(false);
    const beforeEnter = (el) => {
      el.style.height = "0";
    };
    const enter = (el) => {
      el.style.height = el.scrollHeight + "px";
    };
    const beforeLeave = (el) => {
      el.style.height = el.scrollHeight + "px";
    };
    const leave = (el) => {
      el.style.height = "0";
    };
    return {
      isExpanded,
      newX,
      beforeEnter,
      enter,
      beforeLeave,
      leave,
    };
  },
};
</script>


<style lang="scss" scoped>
.custom-accordion {
  display: inline-block;
  position: relative;
}

.accordion-button {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 150ms ease-out;
  padding: 0 10px;
  &::after:hover {
    box-shadow: 0 0 0 calc(var(--buttons-border-width) + var(--border-offset))
        rgba(black, var(--border-opacity)),
      0 0 0 var(--buttons-border-width)
        rgba(var(--color-button), var(--alpha-button-background));
    cursor: pointer;
  }
}

.accordion-heading {
  height: 40px;
  width: 100%;
  padding: 0 10px;
  line-height: 40px;
}

.showX {
  border-bottom-style: solid;
  border-bottom-width: 2px;
}

.header-icon {
  height: 1.5rem;
  width: 1.5rem;
  transform: rotate(-180deg);
  transition-duration: 0.3s;
}

.header-icon.rotate {
  transform: rotate(0deg);
  transition-duration: 0.3s;
}

.accordion-item-details {
  position: absolute;
  z-index: 3;
  right: 0;
  overflow: hidden;
  background-color: lighten(#ffe2d8, 3);
  border-top: 0;
  transition: 150ms ease-out;
  span {
    padding: 5px;
    transition: 150ms ease-out;
    &:hover {
      cursor: pointer;
      background-color: darken(#ffe2d8, 3);
    }
  }
}
</style>