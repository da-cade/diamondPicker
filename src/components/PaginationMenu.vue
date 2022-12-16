<template>
  <!-- Some logic rules -->
  <!-- By default, the pages to the left of the gem will be the last 3 pages, pushed aside by each new page -->
  <!-- The center gem will be an input -->
  <!-- we'll make it in a straight line first -->
  <!-- we already have logic that determines whether we are going up or down -->
  <!-- the transition tag will slide-left or slide-right depending on this direction -->
  <div class="section__pagination">
    <div class="space-0">
      <button @click="showPage(state.foreList[2])">
        ${state.foreList[2]}$
      </button>
    </div>
    <div class="space-1">
      <button @click="showPage(state.foreList[1])">
        ${state.foreList[1]}$
      </button>
    </div>
    <div class="space-2">
      <button @click="showPage(state.foreList[0])">
        ${state.foreList[0]}$
      </button>
    </div>
    <div id="cut-diamond">
      <div id="diamond-overlay">
        <div class="page-display grow">
          <!-- here we put a transition tag to move the next number in -->
          <!-- TODO @input? -->
          <input
            type="number"
            class="current-page"
            v-model="state.localPage"
            @submit.prevent="showPage(state.localPage)"
          />
          <div class="underline"></div>
        </div>
      </div>
    </div>
    <div class="space-3">
      <button @click="showPage(state.afterList[0])">
        ${state.afterList[0]}$
      </button>
    </div>
    <div class="space-4">
      <button @click="showPage(state.afterList[1])">
        ${state.afterList[1]}$
      </button>
    </div>
    <div class="space-5">
      <button @click="showPage(state.afterList[2])">
        ${state.afterList[2]}$
      </button>
    </div>
    <div class="pagination-menu"></div>
  </div>
</template>


<script>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
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
    const state = reactive({
      foreList: [],
      afterList: [],
      ogArrays: [],
      localPage: 1,
    });
    const lastPage = computed(() => {
      return Math.ceil(AppState.totalNumber / props.showX);
    });

    // the reactive code to change the pages displayed
    //   let list = [];
    //   if (
    //     AppState.displayPage >= 3 &&
    //     AppState.displayPage <= lastPage.value - 2
    //   ) {
    //     list[0] = 1;
    //     list[1] = AppState.displayPage - 2;
    //     list[2] = AppState.displayPage - 1;
    //     list[3] = AppState.displayPage;
    //     list[4] = AppState.displayPage + 1;
    //     list[5] = AppState.displayPage + 2;
    //     list[6] = lastPage.value;
    //   } else {
    //     list[0] = AppState.displayPage;
    //     list[1] = 2;
    //     list[2] = 3;
    //     list[3] = 4;
    //     list[4] = 5;
    //     list[5] = 6;
    //     list[6] = lastPage.value;
    //   }

    //   return list;
    // });
    watchEffect(() => {
      if (AppState.displayPage == 1) {
        handleWheel();
      }
    });

    function buildWheel(origin) {
      if (origin == "start") {
        let arr1 = Array.from(Array(3)).map((e, i) => {
          e = lastPage.value - i;
          return e;
        });
        let arr2 = Array.from(Array(3)).map((e, i) => {
          e = state.localPage + 1 + i;
          return e;
        });
        state.ogArrays = [arr1, arr2];
        state.foreList = arr1;
        state.afterList = arr2;
        console.log(state.foreList, state.afterList);
      }
      if (origin == "end") {
        let arr1 = state.ogArrays[0].map((x) => x - 1);
        let arr2 = state.ogArrays[1].map((x) => x - 1);
        state.foreList = arr1;
        state.afterList = arr2;
      }
    }

    function handleWheel(pageNum) {
      console.log(state.localPage);
      if (state.localPage == 1) {
        buildWheel("start");
      } else if (state.localPage == lastPage.value) {
        console.log("go end");
        buildWheel("end");
      } else {
        let paginateDirection =
          pageNum == lastPage.value || pageNum < AppState.displayPage
            ? "prev"
            : "next";

        let movedPages = Array.from(
          Array(Math.abs(pageNum - AppState.displayPage))
        ).map((e, i) => {
          e =
            paginateDirection == "next"
              ? AppState.displayPage + i
              : AppState.displayPage - i;
          return e;
        });

        console.log(movedPages);

        if (paginateDirection == "next") {
          state.afterList = state.afterList.map((e) => {
            if (e + movedPages.length > lastPage.value) {
              return 1 + movedPages.length;
            } else {
              return e + movedPages.length;
            }
          });
          state.foreList = state.foreList.map((_, i, a) => {
            if (a[i - 1] == undefined) {
              let newVal = movedPages[movedPages.length - i - 1];
              return newVal;
            } else {
              return a[i - 1];
            }
          });
        }
        if (paginateDirection == "prev") {
          state.foreList = state.foreList.map((e) => {
            if (e - movedPages.length < 1) {
              return lastPage.value - movedPages.length;
            } else {
              return e - movedPages.length;
            }
          });
          state.afterList = state.afterList.map((_, i, a) => {
            if (a[i - 1] == undefined) {
              let newVal = movedPages[movedPages.length - i - 1];
              return newVal;
            } else {
              return a[i - 1];
            }
          });
        }
      }
    }

    // TODO handleRequests Timer? what happens when we break this thing.
    // logic to determine when to make requests for new pages
    async function showPage(pageNum) {
      pageNum = parseInt(pageNum);
      state.localPage = pageNum;
      let currentPage = Math.ceil((AppState.displayPage * props.showX) / 200);
      let desiredPage = Math.ceil((pageNum * props.showX) / 200);

      handleWheel(pageNum);

      AppState.currentPage = desiredPage;
      AppState.displayPage = state.localPage;

      // if (desiredPage !== currentPage) {
      //   if (Math.abs(desiredPage - currentPage) >= 2) {
      //     AppState.prevPageDiamonds = [];
      //     AppState.nextPageDiamonds = [];
      //     await diamondsService.getDiamondsByQuery();
      //   } else {
      //     if (desiredPage > currentPage) {
      //       AppState.prevPageDiamonds = AppState.diamonds;
      //       AppState.diamonds = AppState.nextPageDiamonds;
      //       await diamondsService.getNextPage();
      //     } else {
      //       AppState.nextPageDiamonds = AppState.diamonds;
      //       AppState.diamonds = AppState.prevPageDiamonds;
      //       await diamondsService.getPrevPage();
      //     }
      //   }
      // }
    }

    return {
      state,
      lastPage,
      showPage,
    };
  },
};
</script>


<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.section__pagination {
  display: flex;
  justify-content: end;
}

.pagination-menu {
}

#cut-diamond {
  border-style: solid;
  border-color: transparent transparent black transparent;
  border-width: 0 15px 15px 15px;
  height: 0;
  width: 30px;
  box-sizing: content-box;
  position: relative;
  margin: 10px 0 30px 0;
  z-index: 1;
  display: flex;
  justify-content: center;
}

#cut-diamond:after {
  content: "";
  position: absolute;
  top: 15px;
  left: -15px;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: black transparent transparent transparent;
  border-width: 40px 30px 0 30px;
  z-index: 1;
}

#diamond-overlay {
  border-style: solid;
  border-color: transparent transparent white transparent;
  border-width: 0 12px 12px 12px;
  height: 0;
  top: 2px;
  width: 28px;
  box-sizing: content-box;
  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: center;
}

#diamond-overlay:after {
  content: "";
  position: absolute;
  top: 14px;
  left: -12px;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
  border-width: 36px 26px 0 26px;
  z-index: 2;
}

.page-display {
  position: absolute;
  top: 12px;
}

.current-page {
  display: flex;
  justify-content: center;
  z-index: 3;
  width: 30px;
  background-color: transparent !important;
  padding: 0 !important;
  border-width: 0px !important;
  text-align: center;
}

.underline {
  position: relative;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.underline::after {
  content: "";
  position: absolute;
  background-color: black;
  border-radius: 2px;
  width: 15px;
  height: 1px;
  margin: 0 auto;
  bottom: 0;
  z-index: 4;
  transform: scaleX(0);
  transition: transform 0.1s linear;
  transform-origin: bottom left;
}

.grow {
}

.grow:hover {
  .underline::after {
    transform: scaleX(1);
  }
}

.current-page:focus-visible {
  outline: transparent none 0px !important;
}

// .grow {
//   transition: all 0.2s ease-in-out;
// }
// .grow:hover {
// transform: scale(1.03);
// }
</style>