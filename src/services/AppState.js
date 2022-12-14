import { reactive } from "vue";
import { TemplateData } from "../assets/TemplateData";
export const AppState = reactive({
  diamonds: [],
  displayDiamonds: [],
  intFilters: [
    "PriceRange",
    "SizeRange",
    "LengthToWidthRatio",
    "TablePercent",
    "DepthPercent",
  ],
  filterValues: JSON.parse(JSON.stringify(TemplateData.filterLabels)),

  totalNumber: 0,
  currentPage: 1,
  workingSection: 1,

  staggerLoad: false,
  nextSetDiamonds: [],
  sendRequest: true,
  timeoutID: "",
  loaded: false,
});
