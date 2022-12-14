import { AppState } from "./AppState.js"
import { api } from "./AxiosService.js"
class DiamondsService {

  formatData() {
    try {
      const formData = {};
      const filterData = JSON.parse(JSON.stringify(AppState.filterValues));
      for (const key in filterData) {
        formData[key] = filterData[key].values;
      }
      // formData["Shape"] = JSON.parse(JSON.stringify(state.Shape));
      formData["Page"] = AppState.currentPage;
      console.log(formData);
      return formData;
    } catch (error) {
      console.log(error.message);
    }
  }
  async getDiamondsByQuery() {
    let query = this.formatData()
    // const res = await api.post("/apps/api/diamonds", query);
    const res = await api.post("/diamonds", query);
    console.log(res.data);
    AppState.nextSetDiamonds = res.data.Diamonds;
    if (!AppState.staggerLoad) {
      AppState.diamonds = JSON.parse(JSON.stringify(AppState.nextSetDiamonds));
    }
    AppState.totalNumber = res.data.TotalNumberOfDiamonds;
  }
}

export const diamondsService = new DiamondsService();