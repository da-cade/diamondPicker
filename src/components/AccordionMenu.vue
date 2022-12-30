<template>
  <div class="custom-accordion" id="filterAccordion">
    <div class="">
      <h2 class="accordion-heading button" @click="isExpanded = !isExpanded">
        Advanced Filters
        <svg
          class="header-icon"
          :class="{ rotate: isExpanded }"
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
      </h2>
    </div>
    <Transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="accordion-item-details row" v-show="isExpanded">
        <!-- NOTE bs5 -->
        <div
          class="col-12 col-md-6"
          v-for="filter in secondLabelSet"
          :key="filter.handle"
        >
          <range-slider :filter="filter"> </range-slider>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script>
import { TemplateData } from "../assets/TemplateData";
import { computed, ref } from "vue";
import RangeSlider from "./RangeSlider.vue";
export default {
  components: { RangeSlider },
  setup() {
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
      beforeEnter,
      enter,
      beforeLeave,
      leave,
      secondLabelSet: computed(() => [
        TemplateData.filterLabels.Cut,
        TemplateData.filterLabels.Color,
        TemplateData.filterLabels.Clarity,
        TemplateData.filterLabels.Polish,
        TemplateData.filterLabels.Symmetry,
        TemplateData.filterLabels.Fluorescence,
        TemplateData.filterLabels.LengthToWidthRatio,
        TemplateData.filterLabels.DepthPercent,
        TemplateData.filterLabels.TablePercent,
      ]),
    };
  },
};
</script>


<style lang="scss" scoped>
.accordion-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  line-height: 40px;
  padding: 0 40px 0 8px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
}

.header-icon {
  // color: white;
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
  overflow: hidden;
  background-color: #fff;
  border-top: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  transition: 150ms ease-out;
}
</style>