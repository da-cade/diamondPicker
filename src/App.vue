    
    <!-- we need our special diamond filter -->
    <!-- we need pagination -->
      <!-- pagination function -->
    <!-- a diamond item component -- props: diamond object -->
    <!-- a diamond SIDE - details component props: diamond object -->
    <!-- a diamond MODAL - details component props: diamond object -->
    <!-- filter item - range, interval_count, labels (should equal interval_count) -->
<!-- what are we gonna use the style tags for? -->
<!-- can we communicate with the json files in the Theme w/o requesting them? Some things seem to be accessible -->
<!-- so far, we CAN set our own settings. what should they be? -->
<!-- Local settings:  -->
<!-- Imported Settings: Text-color-1, Text-color-2, Light-Background-1, Accent-1, page-width, font -->
<!-- diamond filters -->
<!--  -->



<template>
  <filter-container />
  <diamond-view />

  <details-modal />
</template>

<script>
import DetailsModal from "./components/DetailsModal.vue";
import FilterContainer from "./components/FilterContainer.vue";
import DiamondView from "./components/DiamondView.vue";
import { onMounted } from "vue";
import { diamondsService } from "./services/DiamondsService";
export default {
  components: { DetailsModal, FilterContainer, DiamondView },
  setup() {
    onMounted(async () => {
      await diamondsService.getDiamondsByQuery();
    });
    return {};
  },
};
</script>

<style lang="scss">
.filter-item > input {
  width: 80%;
}

$icon-size: 2.5rem;
$accent-color: rgb(255, 201, 201);
</style>
