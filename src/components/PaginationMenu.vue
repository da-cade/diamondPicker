<template>
  <!-- Some logic rules -->
  <!-- By default, the pages to the left of the gem will be the last 3 pages, pushed aside by each new page -->
  <!-- The center gem will be an input -->
  <!-- we'll make it in a straight line first -->
  <!-- we already have logic that determines whether we are going up or down -->
  <!-- the transition tag will slide-left or slide-right depending on this direction -->
  <div class="section__pagination">
    <div class="space-0">
      <button @click="showPage(state.pageList[0])">
        ${state.pageList[0]}$
      </button>
    </div>
    <div class="space-1">
      <button @click="showPage(state.pageList[1])">
        ${state.pageList[1]}$
      </button>
    </div>
    <div class="space-2">
      <button @click="showPage(state.pageList[2])">
        ${state.pageList[2]}$
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
            v-model="state.pageList[3]"
            @submit.prevent="showPage(state.pageList[3])"
          />
          <div class="underline"></div>
        </div>
      </div>
    </div>
    <div class="space-3">
      <button @click="showPage(state.pageList[4])">
        ${state.pageList[4]}$
      </button>
    </div>
    <div class="space-4">
      <button @click="showPage(state.pageList[5])">
        ${state.pageList[5]}$
      </button>
    </div>
    <div class="space-5">
      <button @click="showPage(state.pageList[6])">
        ${state.pageList[6]}$
      </button>
    </div>
    <div class="pagination-menu"></div>
  </div>
</template>


<script>
import { computed, reactive, watchEffect } from "vue";
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
      pageList: [],
      localPage: 1,
    });
    const lastPage = computed(() => {
      return Math.ceil(AppState.totalNumber / props.showX);
    });

    function buildWheel() {
      let arr1 = Array.from(Array(3))
        .map((e, i) => {
          e = lastPage.value - i;
          return e;
        })
        .reverse();
      let arr2 = Array.from(Array(4)).map((e, i) => {
        e = state.localPage + i;
        return e;
      });
      state.pageList = arr1.concat(arr2);
      animateCenter();
    }

    function handleWheel(pageNum) {
      function pagesToMove(pageNum, arr) {
        let index = arr.indexOf(pageNum);
        let numberToPaginate = arr.slice(3, index).length;
        let valueForMapping = arr[arr.length - 1];
        return [numberToPaginate, valueForMapping];
      }

      function shiftIndecesByX(arr, shiftAmount) {
        return arr.map((_, i, a) => a[(i + shiftAmount) % a.length]);
      }

      function addOnPages(startPoint, totalAdditions, direction) {
        return Array.from(Array(totalAdditions)).map((e, i) => {
          let output =
            direction == "prev" ? startPoint - i - 1 : startPoint + i + 1;
          if (output > lastPage.value && direction == "next") {
            output = 1;
          } else if (output < 1 && direction == "prev") {
            output = lastPage.value;
          }
          return output;
        });
      }

      let pageList = [...state.pageList];

      let paginateDirection = pageList.slice(0, 3).includes(pageNum)
        ? "prev"
        : "next";

      pageList = paginateDirection == "prev" ? pageList.reverse() : pageList;

      const movedPages = pagesToMove(pageNum, ...[pageList]);

      pageList = shiftIndecesByX(pageList, movedPages[0]);

      let arr = addOnPages(movedPages[1], movedPages[0], paginateDirection);

      pageList.splice(pageList.length - movedPages[0], movedPages[0], ...arr);
      pageList = paginateDirection == "prev" ? pageList.reverse() : pageList;

      state.pageList = pageList;
      animateCenter();
    }

    function animateCenter() {
      const underlineSlash = [
        { transform: "scaleX(0)" },
        { transform: "scaleX(1)" },
      ];

      const underlineTiming = {
        fill: "forwards",
        duration: 100,
        easing: "linear",
      };

      const centerPop = [
        { transform: "translateY(100%)" },
        { transform: "translateY(0)" },
      ];
      const centerTiming = {
        duration: 400,
        delay: 100,
        fill: "backwards",
        iterations: 1,
        easing: "cubic-bezier(0.6, 0.14, 0.9, 0.55)",
      };

      const underline = document.querySelector(".underline");
      const center = document.querySelector(".current-page");
      underline.animate(underlineSlash, underlineTiming);
      center.animate(centerPop, centerTiming);
    }
    // TODO handleRequests Timer? what happens when we break this thing.

    // logic to determine when to make requests for new pages
    async function showPage(pageNum) {
      // animateRing(){}
      pageNum = parseInt(pageNum);
      state.localPage = pageNum;
      let currentPage = Math.ceil((AppState.displayPage * props.showX) / 200);
      let desiredPage = Math.ceil((pageNum * props.showX) / 200);

      handleWheel(pageNum);

      AppState.currentPage = desiredPage;
      AppState.displayPage = pageNum;

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

    watchEffect(() => {
      if (AppState.buildWheel) {
        AppState.buildWheel = false;
        buildWheel();
      }
    });

    return {
      state,
      lastPage,
      loaded: computed(() => AppState.loaded),
      showPage,
    };
  },
};
</script>


<style lang="scss" scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 2s ease-out;
}

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
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.current-page {
  z-index: 3;
  width: 30px;
  background-color: transparent !important;
  padding: 0 !important;
  border-width: 0px !important;
  text-align: center;
}

.underline {
  position: absolute;
  background-color: black;
  border-radius: 2px;
  width: 15px;
  height: 1px;
  margin: 0 auto;
  bottom: 0;
  z-index: 4;
  transform: scaleX(0);
  transform-origin: bottom left;
}

// .grow:hover {
//   .underline::after {
//     transform: scaleX(1);
//   }
// }

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