import { AppState } from "./AppState.js"
import { api } from "./AxiosService.js"

// const Timer = {
//   async getUpdates() {
//     console.log("updating");
//     await diamondsService.getDiamondsByQuery();
//     this.timeoutID = undefined;
//   },
//   async setTimer() {
//     console.log(this.timeoutID);
//     if (typeof this.timeoutID === "number") {
//       console.log("cancelling");
//       this.cancelTimer();
//     }
//     this.timeoutID = setInterval(async () => {
//       await this.getUpdates();
//     }, 1000);
//   },
//   cancelTimer() {
//     console.log("clearing");
//     clearTimeout(this.timeoutID);
//   },
// };

async function handleTimer() {
  await new Promise((resolve) => {
    let id;
    if (typeof id === "number") {
      clearTimeout(id)
    }
    setTimeout(resolve, 1000)
  });
}

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

  async handleRequests() {
    await handleTimer();
    await this.getDiamondsByQuery()
    console.log("beyond timer");
  }
  async sendRequest() {
    let res = await api.post("/diamonds", AppState.parameters);
    return res
  }
  async getDiamondsByQuery() {
    AppState.loaded = false;
    // @ts-ignore
    AppState.parameters = this.formatData()
    // const res = await api.post("/apps/api/diamonds", query);
    let res = await this.sendRequest()
    console.log(res.data);
    AppState.diamonds = res.data.Diamonds;
    AppState.totalNumber = res.data.TotalNumberOfDiamonds;
    AppState.displayPage = 1;
    AppState.loaded = true
    if (AppState.currentPage !== 1) {
      if (!AppState.prevPageDiamonds.length) {
        await this.getPrevPage()
      }
    }
    if (AppState.currentPage !== Math.ceil(res.data.TotalNumberOfDiamonds / 200)) {
      if (!AppState.nextPageDiamonds.length) {
        await this.getNextPage()
      }
    }

  }

  async getNextPage() {
    AppState.parameters.Page += 1;
    let res = await this.sendRequest()
    AppState.nextPageDiamonds = res.data.Diamonds;
    console.log("next", res.data)
  }
  async getPrevPage() {
    AppState.parameters.Page -= 1;
    let res = await this.sendRequest()
    AppState.prevPageDiamonds = res.data.Diamonds;
    console.log("pre", res.data)
  }
}

export const diamondsService = new DiamondsService();