import { AppState } from "../AppState.js"
import { api } from "./AxiosService.js"

class DiamondsService {
  formatData() {
    try {
      const formData = {};
      const filterData = JSON.parse(JSON.stringify(AppState.filterValues));
      for (const key in filterData) {
        formData[key] = filterData[key].values;
      }
      formData["Page"] = AppState.currentPage;
      // formData["Shape"] = AppState.shapes;
      console.log(formData)
      return formData;
    } catch (error) {
      console.log(error.message);
    }
  }
  async sendRequest(req) {
    let res = await api.post("/diamonds", req);
    // let res = await api.post("/apps/api/diamonds", req);
    return res;
  }
  async getDiamondsByQuery() {
    AppState.loaded = false;
    AppState.parameters = this.formatData()
    let res = await this.sendRequest(AppState.parameters)
    console.log(res.data)
    AppState.diamonds = res.data.Diamonds;
    AppState.totalNumber = res.data.TotalNumberOfDiamonds;
    AppState.loaded = true;

    if (AppState.currentPage !== 1) {
      await this.getPrevPage()
    }
    if (AppState.currentPage !== Math.ceil(res.data.TotalNumberOfDiamonds / 200)) {
      await this.getNextPage()
    }

  }

  async getNextPage() {
    let body = JSON.parse(JSON.stringify(AppState.parameters))
    body.Page += 1
    let res = await this.sendRequest(body)
    AppState.nextPageDiamonds = res.data.Diamonds;
  }
  async getPrevPage() {
    let body = JSON.parse(JSON.stringify(AppState.parameters))
    body.Page -= 1
    let res = await this.sendRequest(body)
    AppState.prevPageDiamonds = res.data.Diamonds;
  }
}

export const diamondsService = new DiamondsService();