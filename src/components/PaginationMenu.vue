<template>
  <div class="section__pagination">
    <button v-for="p in pageList" :key="p" @click="showPage(p)">${p}$</button>
    <button @click="showPage(lastPage)">${lastPage}$</button>
  </div>
</template>


<script>
import { computed, ref } from "vue";
import { AppState } from "../services/AppState";
export default {
  props: {
    showX: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    let localPage = ref(1);
    const lastPage = computed(() => {
      return Math.ceil(AppState.totalNumber / props.showX);
    });

    // this represents the number of pages we can load without requesting more.

    // this represents the total number of pages possible based on how many diamonds we choose to show.
    const pageList = computed(() => {
      let pageList = [];
      let start = 0;
      let end = 0;
      console.log(pageList);
      if (localPage.value < 3) {
        start = 1;
        end = 1 + 4;
      } else if (localPage.value <= lastPage.value - 3) {
        end = lastPage.value;
      } else {
        start = localPage.value - 2;
        end = localPage.value + 2;
      }
      for (let i = start; i <= end; i++) {
        pageList.push(i);
      }
      return pageList;
    });

    const workingPages = computed(() => {
      return AppState.diamonds.length / props.showX;
    });

    async function showPage(pageNum) {
      pageNum = parseInt(pageNum);

      // if pageNumber is greater than current page + pagesLoaded.value or less than that:
      AppState.currentPage = Math.ceil((pageNum * props.showX) / 200);
      // i want to show the results based on the current api page, but slice the results to reflect where in the local pages we are
      // get local page, that equals pageNum. slice the results based on showX, and the portion of the available diamonds that are shown according to the pageNum.
      // working pages reflects the number of pages we have to work with.
      AppState.workingSection =
        pageNum % workingPages.value !== 0
          ? pageNum % workingPages.value
          : workingPages.value;

      if (
        pageNum > workingPages.value + localPage.value ||
        pageNum < localPage.value - workingPages.value
      ) {
        AppState.sendRequest = !AppState.sendRequest;
      } else if (AppState.workingSection == workingPages.value) {
        AppState.staggerLoad = !AppState.staggerLoad;
        AppState.sendRequest = !AppState.sendRequest;
      } else if (AppState.workingSection == 1) {
        AppState.diamonds = JSON.parse(
          JSON.stringify(AppState.nextSetDiamonds)
        );
      } else {
        return;
      }
      localPage.value = pageNum;

      // if (
      //   pageNum > localPage.value + pagesLoaded.value ||
      //   pageNum < localPage.value - pagesLoaded.value
      // ) {
      //   AppState.currentPage = Math.ceil((pageNum * props.showX) / 200);
      //   AppState.sendRequest = !AppState.sendRequest;
      // } else {
      //   AppState.displayDiamonds = AppState.diamonds.slice(
      //     props.showX * (pageNum - 1),
      //     props.showX * (pageNum - 1) + props.showX
      //   );
      // }
      localPage.value = pageNum;
    }
    return {
      localPage,
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