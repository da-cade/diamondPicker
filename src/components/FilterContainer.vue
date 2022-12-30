<template>
  <div class="index__content" style="width: 100%">
    <div class="section__filters row">
      <div class="diamondTitle col-12 col-md-6 col-lg-3 p-3">
        <h1>The Portsche's Diamond Index</h1>
      </div>
      <div class="shapes col-12 col-md-6 col-lg-9 mb-3">
        <shape-filter />
      </div>
    </div>

    <div class="section__filters row">
      <div
        class="col-12 col-md-6"
        v-for="filter in firstLabelSet"
        :key="filter.handle"
      >
        <range-slider :filter="filter"> </range-slider>
      </div>
    </div>
    <accordion-menu />
  </div>
</template>


<script>
import { computed } from "vue";
import AccordionMenu from "./AccordionMenu.vue";
import RangeSlider from "./RangeSlider.vue";
import ShapeFilter from "./ShapeFilter.vue";
import { TemplateData } from "../assets/TemplateData";
export default {
  components: { RangeSlider, AccordionMenu, ShapeFilter },
  setup() {
    return {
      firstLabelSet: computed(() => [
        TemplateData.filterLabels.PriceRange,
        TemplateData.filterLabels.SizeRange,
      ]),
    };
  },
};
</script>


<style lang="scss" scoped>
.shapes {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section__filters {
  @media (min-width: 750px) {
    margin-bottom: 2rem;
  }
}
</style>