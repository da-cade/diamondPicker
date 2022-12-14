<template>
  <div class="section__body container-fluid mt-5">
    <div class="section__showX">
      <span
        >Showing
        <button
          class="dropdown-toggle"
          type="button"
          id="showMoreDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ${state.showX}$
        </button>
        <ul class="dropdown-menu" aria-labelledby="showMoreDropdown">
          <li>
            <a class="dropdown-item" @click="state.showX = 20" href="#">20</a>
          </li>
          <li>
            <a class="dropdown-item" @click="state.showX = 50" href="#">50</a>
          </li>
          <li>
            <a class="dropdown-item" @click="state.showX = 100" href="#">100</a>
          </li>
        </ul>
        per page.</span
      >
    </div>
    <div class="section__index">
      <table class="table">
        <thead>
          <tr class="">
            <th scope="col">
              <button @click="sortItems('Shape')">shape <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('CaratWeight')">carat <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('Make')">cut <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('Color')">color <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('Clarity')">clarity <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('Price')">price <i></i></button>
            </th>
            <th scope="col">
              <button @click="sortItems('Lab')">lab <i></i></button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="di in displayDiamonds" :key="di.SerialNumber">
            <th scope="col">
              ${di.Shape == 'SQUARE' ? 'Princess' : di.Shape}$
            </th>
            <th scope="col">${di.CaratWeight}$</th>
            <th scope="col">${di.Make}$</th>
            <th scope="col">${di.Color}$</th>
            <th scope="col">${di.Clarity}$</th>
            <th scope="col">${di.Price.Value}$</th>
            <th scope="col">${di.Certification}$</th>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination-menu :showX="state.showX" />
    <div class="side-details">
      <side-details />
    </div>
  </div>
</template>


<script>
import { computed, reactive } from "vue";
import { watchEffect } from "vue";
import { AppState } from "../services/AppState";
import { diamondsService } from "../services/DiamondsService";
import SideDetails from "./SideDetails.vue";
import PaginationMenu from "./PaginationMenu.vue";
export default {
  components: { SideDetails, PaginationMenu },
  setup() {
    const state = reactive({
      showX: 20,
      sortBy: "",
      sortReverse: false,
    });

    const handleTimer = {
      async passToUpdate() {
        await diamondsService.getDiamondsByQuery();
        if (AppState.staggerLoad) {
          AppState.staggerLoad = !AppState.staggerLoad;
        }
        AppState.timeoutID = undefined;
      },
      setup() {
        if (typeof AppState.timeoutID === "number") {
          this.cancel();
        }
        AppState.timeoutID = setTimeout(() => {
          this.passToUpdate();
        }, 1000);
      },
      cancel() {
        clearTimeout(AppState.timeoutID);
      },
    };

    watchEffect(async () => {
      if (AppState.sendRequest) {
        handleTimer.setup();
        AppState.sendRequest = !AppState.sendRequest;
      }
    });

    watchEffect(() => {
      if (AppState.diamonds.length) {
        AppState.displayDiamonds = AppState.diamonds.slice(
          state.showX * (AppState.workingSection - 1),
          state.showX * AppState.workingSection
        );
      }
    });

    function sortItems(sortValue) {
      if (AppState.diamonds.length) {
        if (state.sortReverse) {
          console.log(state.sortBy);
          state.sortBy = "";
          state.sortReverse = false;
          AppState.diamonds.sort((a, b) => {
            return b.CaratWeight - a.CaratWeight;
          });
          return;
        }
        if (state.sortBy !== "" && state.sortBy == sortValue) {
          console.log(state.sortBy);
          state.sortReverse = true;
          AppState.diamonds.reverse();
          return;
        }
        if (state.sortBy !== sortValue) {
          console.log(state.sortBy);
          state.sortBy = sortValue;
          AppState.diamonds.sort(function (a, b) {
            if (a[sortValue] < b[sortValue]) {
              return -1;
            }
            if (a[sortValue] > b[sortValue]) {
              return 1;
            }
            return 0;
          });
        }
      }
    }
    return {
      state,
      displayDiamonds: computed(() => AppState.displayDiamonds),
      sortItems,
    };
  },
};
</script>


<style lang="scss" scoped>
</style>