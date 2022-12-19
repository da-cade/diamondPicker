import { reactive } from "vue";
import { TemplateData } from "../assets/TemplateData";
export const AppState = reactive({
  prevPageDiamonds: [],
  diamonds: [],
  nextPageDiamonds: [],
  displayDiamonds: [],
  showModal: false,

  parameters: {},

  filterValues: JSON.parse(JSON.stringify(TemplateData.filterLabels)),

  buildWheel: false,
  totalNumber: 0,
  currentPage: 1,
  displayPage: 0,
  workingSection: 1,

  sendRequest: false,
  timeoutID: undefined,
  loaded: false,
});
