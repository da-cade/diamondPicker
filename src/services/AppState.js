import { reactive } from "vue";
import { TemplateData } from "../assets/TemplateData";
export const AppState = reactive({
  prevPageDiamonds: [],
  diamonds: [],
  nextPageDiamonds: [],
  displayDiamonds: [],

  parameters: {},

  filterValues: JSON.parse(JSON.stringify(TemplateData.filterLabels)),

  totalNumber: 0,
  currentPage: 1,
  displayPage: 1,
  workingSection: 1,

  staggerLoad: false,
  sendRequest: false,
  timeoutID: undefined,
  loaded: false,
});
