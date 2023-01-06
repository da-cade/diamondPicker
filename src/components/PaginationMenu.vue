<template>
  <div class="section__pagination">
    <div class="pagination-menu">
      <div class="page-item" v-if="state.pageList[state.pageList.length - 3]">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 3])"
        >
          <span>${state.pageList[state.pageList.length - 3]}$</span>
        </div>
      </div>
      <div class="page-item" v-if="state.pageList[state.pageList.length - 2]">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 2])"
        >
          <span>${state.pageList[state.pageList.length - 2]}$</span>
        </div>
      </div>
      <div class="page-item" v-if="state.pageList[state.pageList.length - 1]">
        <div
          class="page-button"
          @click="showPage(state.pageList[state.pageList.length - 1])"
        >
          <span>${state.pageList[state.pageList.length - 1]}$</span>
        </div>
      </div>
      <div class="center-item">
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
      </div>
      <div class="page-item" v-if="state.pageList[1]">
        <div class="page-button" @click="showPage(state.pageList[1])">
          <span>${state.pageList[1]}$</span>
        </div>
      </div>
      <div class="page-item" v-if="state.pageList[2]">
        <div class="page-button" @click="showPage(state.pageList[2])">
          <span>${state.pageList[2]}$</span>
        </div>
      </div>
      <div class="page-item" v-if="state.pageList[3]">
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
import { animationLib } from "../utils/AnimationLib";
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
      localPage: undefined,
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

    function animatePages(direction, pageList, amount) {
      // here we're going to run a dasher animation
      // we're also going to dropdown all the elements.

      const underline = document.querySelector(".underline");
      const center = document.querySelector(".current-page");
      const pages = document.querySelectorAll(".page-button");

      function animationStack() {
        // first, we start the dasher
        // next, un-underline
        // next, we drop the center
        // then we drop the rest
        // change data
        // pop up rest
        // pop up center
        // underline
        animationLib.animateSlash(underline, -1);
        animationLib.vertSlide(center, -1);
        animationLib.vertSlide(pages, -1);
        return Promise.all(
          pages[pages.length - 1]
            // eslint-disable-next-line prettier/prettier
            .getAnimations()
            .map((animation) => animation.finished)
        )
          .then(() => {
            state.pageList = pageList;
            state.localPage = pageList[0];
          })
          .then(() => {
            animationLib.vertSlide(pages, 1);
          })
          .then(() => animationLib.vertSlide(center, 1))
          .then(() => {
            animationLib.animateSlash(underline, 1);
          });
      }

      if (pageList) {
        animationStack();
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
      if (AppState.loaded && AppState.buildWheel) {
        AppState.buildWheel = false;
        state.pageList = Array.from(Array(lastPage.value)).map((e, i) => i + 1);
        state.localPage = state.pageList[0];
        animationLib.vertSlide(document.querySelector(".current-page"), 1);
        animationLib.animateSlash(document.querySelector(".underline"), 1);
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
  height: 3.5rem;
  width: 18rem;
  align-items: flex-end;
  justify-content: space-between;
}

.page-item {
  max-width: 1.3rem;
}

.page-button {
  display: flex;
  justify-content: center;
}

.page-item:nth-child(1),
.page-item:nth-child(7) {
  font-size: 1em;
}

.page-item:nth-child(2),
.page-item:nth-child(6) {
  font-size: 1.15em;
}
.page-item:nth-child(3),
.page-item:nth-child(5) {
  font-size: 1.45em;
}

.page-item:hover {
  cursor: pointer;
}

.center-item {
  .page-item {
    margin-top: 0 !important;
  }
  position: relative;
  align-self: flex-start;
  width: 4rem;
  display: flex;
  justify-content: center;
}

.diamond-input {
  position: absolute;
}

#cut-diamond {
  position: relative;
  border-style: solid;
  border-color: transparent transparent black transparent;
  border-width: 0 15px 15px 15px;
  height: 0;
  width: 30px;
  box-sizing: content-box;
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
  border-width: 0 13px 13px 13px;
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
  top: 13px;
  left: -13px;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
  border-width: 36px 27px 0 27px;
  z-index: 2;
}

.page-button {
  text-align: center;
}

.page-display {
  height: 40px;
  min-width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 3;
}

.current-page {
  font-size: 1.65em !important;
  width: 100%;
  background-color: transparent !important;
  padding: 0 !important;
  border-width: 0px !important;
  text-align: center;
  appearance: inherit;
}

.underline {
  background-color: black;
  border-radius: 2px;
  width: 15px;
  height: 1px;
  z-index: 4;
  transform: scaleX(0);
  transform-origin: bottom left;
}

.current-page:focus-visible {
  outline: transparent none 0px !important;
}
</style>