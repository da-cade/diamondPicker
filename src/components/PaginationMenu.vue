<template>
  <div class="section__pagination">
    <button v-if="!pageList.includes(1)" @click="showPage(1)">1</button>
    <button @click="showPage(pageList[0])">${pageList[0]}$</button>
    <button @click="showPage(pageList[1])">${pageList[1]}$</button>
    <button @click="showPage(pageList[2])">${pageList[2]}$</button>
    <button @click="showPage(pageList[3])">${pageList[3]}$</button>
    <button @click="showPage(pageList[4])">${pageList[4]}$</button>
    <button v-if="!pageList.includes(lastPage)" @click="showPage(lastPage)">
      ${lastPage}$
    </button>
  </div>
</template>


<script>
import { computed } from "vue";
import { AppState } from "../services/AppState";
import { diamondsService } from "../services/DiamondsService";
export default {
  props: {
    showX: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const lastPage = computed(() => {
      return Math.ceil(AppState.totalNumber / props.showX);
    });

    // the reactive code to change the pages displayed
    const pageList = computed(() => {
      let list = [];
      if (
        AppState.displayPage >= 3 &&
        AppState.displayPage <= lastPage.value - 2
      ) {
        list[0] = 1;
        list[1] = AppState.displayPage - 1;
        list[2] = AppState.displayPage;
        list[3] = AppState.displayPage + 1;
        list[4] = lastPage.value;
      } else {
        list[0] = 1;
        list[1] = 2;
        list[2] = 3;
        list[3] = 4;
        list[4] = lastPage.value;
      }

      return list;
    });

    async function showPage(pageNum) {
      pageNum = parseInt(pageNum);
      let currentPage = Math.ceil((AppState.displayPage * props.showX) / 200);
      let desiredPage = Math.ceil((pageNum * props.showX) / 200);

      AppState.currentPage = desiredPage;
      AppState.displayPage = pageNum;

      console.log(currentPage, desiredPage);

      if (desiredPage !== currentPage) {
        if (Math.abs(desiredPage - currentPage) >= 2) {
          AppState.prevPageDiamonds = [];
          AppState.nextPageDiamonds = [];
          await diamondsService.getDiamondsByQuery();
        } else {
          if (desiredPage > currentPage) {
            AppState.prevPageDiamonds = AppState.diamonds;
            AppState.diamonds = AppState.nextPageDiamonds;
            await diamondsService.getNextPage();
          } else {
            AppState.nextPageDiamonds = AppState.diamonds;
            AppState.diamonds = AppState.prevPageDiamonds;
            await diamondsService.getPrevPage();
          }
        }
      }
    }

    return {
      lastPage,
      pageList,
      showPage,
    };
  },
};
</script>


<style lang="scss" scoped>
.section__pagination {
  display: flex;
  width: 100%;
  justify-content: end;
}
</style>