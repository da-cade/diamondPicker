import { reactive } from "vue";
import { TemplateData } from "./assets/TemplateData";
export const AppState = reactive({
  prevPageDiamonds: [],
  diamonds: [],
  nextPageDiamonds: [],
  displayDiamonds: [],
  shapes: [],
  showModal: false,

  parameters: {},

  filterValues: JSON.parse(JSON.stringify(TemplateData.filterLabels)),

  buildWheel: false,
  totalNumber: 0,
  currentPage: 1,
  displayPage: 1,
  workingSection: 1,

  makeRequest: false,
  timeoutID: undefined,
  loaded: false,
});
