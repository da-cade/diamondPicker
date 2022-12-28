<template>
  <div class="section__pagination">
    <!-- <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[0])">
        ${state.pageList[0]}$
      </span>
    </div>
    <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[1])">
        ${state.pageList[1]}$
      </span>
    </div>
    <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[2])">
        ${state.pageList[2]}$
      </span>
    </div>
    
    <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[4])">
        ${state.pageList[4]}$
      </span>
    </div>
    <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[5])">
        ${state.pageList[5]}$
      </span>
    </div>
    <div class="page-item">
      <span class="page-button" @click="showPage(state.pageList[6])">
        ${state.pageList[6]}$
      </span>
    </div> -->
    <div class="pagination-menu">
      <div class="page-item">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 3])"
        >
          <span>${state.pageList[state.pageList.length - 3]}$</span>
        </div>
      </div>
      <div class="page-item">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 2])"
        >
          <span>${state.pageList[state.pageList.length - 2]}$</span>
        </div>
      </div>
      <div class="page-item">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 1])"
        >
          <span>${state.pageList[state.pageList.length - 1]}$</span>
        </div>
      </div>
      <div class="page-item">
        <div class="page-button">
          <span>${state.pageList[0]}$</span>
        </div>
      </div>
      <div class="diamond-input">
        <div id="cut-diamond">
          <div id="diamond-overlay">
            <div class="page-display grow">
              <form action="" @submit.prevent="showPage(state.localPage)">
                <input
                  type="number"
                  class="current-page"
                  v-model="state.localPage"
                />
              </form>
              <div class="underline"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-item">
        <div class="page-button" @click="showPage(state.pageList[1])">
          <span>${state.pageList[1]}$</span>
        </div>
      </div>
      <div class="page-item">
        <div class="page-button" @click="showPage(state.pageList[2])">
          <span>${state.pageList[2]}$</span>
        </div>
      </div>
      <div class="page-item">
        <div class="page-button" @click="showPage(state.pageList[3])">
          <span>${state.pageList[3]}$</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, reactive, watchEffect } from "vue";
import { AppState } from "../AppState";
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
      buildWheel: true,
    });
    const lastPage = computed(() => {
      return Math.ceil(AppState.totalNumber / props.showX);
    });

    function handleWheel(pageNum) {
      function shift(pageNum, direction) {
        let arr = pageList;
        let count = 1;
        while (arr[0] !== pageNum) {
          if (direction) {
            arr = pageList.map((_, i, a) => a[(i + count) % a.length]);
          } else {
            arr = pageList.map(
              (_, i, a) => a[(i + a.length - count) % a.length]
            );
          }
          count++;
        }
        pageList = arr;
        return count;
      }

      let pageList = [...state.pageList];

      let paginateDirection = pageList.slice(0, 4).includes(pageNum)
        ? true
        : false;

      let distanceShifted = shift(pageNum, paginateDirection) - 1;

      animatePages(paginateDirection, pageList, distanceShifted);
    }

    function animateSlash(vertDirection) {
      const underlineSlash =
        vertDirection == 1
          ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
          : [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }];

      const underlineTiming = {
        fill: "forwards",
        duration: 100,
        delay: vertDirection == -1 ? 0 : 500,
        easing: "linear",
      };

      const underline = document.querySelector(".underline");
      underline.animate(underlineSlash, underlineTiming);
    }

    function animateCenter(vertDirection) {
      const centerPop =
        vertDirection == -1
          ? [{ transform: "translateY(0)" }, { transform: `translateY(100%)` }]
          : [{ transform: `translateY(100%)` }, { transform: "translateY(0)" }];
      const centerTiming = {
        duration: 250,
        delay: 0,
        fill: "forwards",
        iterations: 1,
        easing: "cubic-bezier(0.6, 0.14, 0.9, 0.55)",
      };

      const center = document.querySelector(".current-page");

      center.animate(centerPop, centerTiming);
    }

    function animatePages(direction, pageList, amount) {
      const pages = document.querySelectorAll(".page-item");

      const slideRight = [
        { transform: "translateX(0)" },
        { transform: `translateX(-${amount}00%)` },
      ];

      const slideLeft = [
        { transform: "translateX(0)" },
        { transform: `translateX(${amount}00%)` },
      ];

      const returnHome = [
        {
          transform: "translateX(0)",
        },
      ];

      const slideTiming = {
        fill: "both",
        duration: 40 * (10 / (amount * (1 / amount))),
        iterations: 1,
        // easing: "cubic-bezier(0.6, 0.14, 0.9, 0.55)",
        easing: "ease-in-out",
      };

      function animateElements(anim, timing, elems) {
        elems.forEach((p) => p.animate(anim, timing));
      }

      function runAnimations() {
        animateSlash(-1);
        animateCenter(-1);
        animateElements(direction ? slideRight : slideLeft, slideTiming, pages);
        return Promise.all(
          pages[pages.length - 1]
            .getAnimations()
            .map((animation) => animation.finished)
        )
          .then(() => {
            state.pageList = pageList;
            state.localPage = pageList[0];
          })
          .then(() => {
            animateElements(returnHome, slideTiming, pages);
          })
          .then(() => animateCenter(1))
          .then(() => {
            animateSlash(1);
          });
      }

      if (pageList) {
        runAnimations();
      }
    }

    async function showPage(pageNum) {
      pageNum = parseInt(pageNum);
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
      if (AppState.loaded && state.buildWheel) {
        state.buildWheel = false;
        state.pageList = Array.from(Array(lastPage.value)).map((e, i) => i + 1);
        state.localPage = state.pageList[0];
        animateCenter(1);
        animateSlash(1);
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
  align-items: center;
  justify-content: end;
}

.pagination-menu {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}

.diamond-input {
  position: absolute;
}

#cut-diamond {
  border-style: solid;
  border-color: transparent transparent black transparent;
  border-width: 0 15px 15px 15px;
  height: 0;
  width: 30px;
  box-sizing: content-box;
  position: relative;
  // margin: 10px 0 30px 0;
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

.page-item {
  overflow: hidden;
  width: 40px;
}

.page-item:hover {
  cursor: pointer;
}

.page-button {
  border: black solid 2px;
  padding: 0.5rem;
  text-align: center;
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

.current-page:focus-visible {
  outline: transparent none 0px !important;
}
</style>