import { reactive } from "vue";
export const AppState = reactive({
  diamonds: [],
  intFilters: [
    "PriceRange",
    "SizeRange",
    "LengthToWidthRatio",
    "TablePercent",
    "DepthPercent",
  ],
});
