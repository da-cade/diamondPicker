import { AppState } from "./AppState.js"
import { api } from "./AxiosService.js"
class DiamondsService {
  async getDiamondsByQuery(query) {
    // const res = await api.post("/apps/api/diamonds", query);
    const res = await api.post("/diamonds", query);
    console.log(res.data);
    AppState.diamonds = res.data.Diamonds;
    AppState.totalNumber = res.data.TotalNumberOfDiamonds;
    AppState.nextPage = res.data.NextPage || "";
    AppState.previousPage = res.data.PreviousPage || ""
  }
}

export const diamondsService = new DiamondsService();