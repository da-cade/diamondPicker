<template>
  <!-- NOTE bs5 -->
  <div class="section__body container-fluid mt-5">
    <!-- NOTE bs5 -->
    <div class="section__showX">
      <!-- <span
        >Showing
        <button
          class="dropdown-toggle"
          type="button"
          id="showMoreDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ${state.showX}$
        </button> -->
      <dropdown :showX="state.showX" @show-x="(i) => (state.showX = i)" />
      <!-- per page.</span -->
      <!-- > -->
    </div>
    <div v-if="!loaded" class="loader">Loading</div>
    <div v-else class="section__index">
      <!-- NOTE table qualities adjusted -->
      <table class="table">
        <thead>
          <tr class="">
            <!-- NOTE bs5 -->
            <th class="sortButton" @click="sortItems('Shape')" scope="col">
              <span>Shape <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Size')">
              <span>Carat <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Cut')">
              <span>Cut <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Color')">
              <span>Color <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Clarity')">
              <span>Clarity <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Price')">
              <span>Price <i></i></span>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Lab')">
              <span>Lab <i></i></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="di in displayDiamonds"
            :key="di.SerialNumber"
            @click="popModal(di.SerialNumber)"
          >
            <!-- NOTE bs5 -->
            <th scope="col">
              ${di.Shape == 'SQUARE' ? 'Princess' : di.Shape}$
            </th>
            <th scope="col">${di.Size}$</th>
            <th scope="col">${di.Cut}$</th>
            <th scope="col">${di.Color}$</th>
            <th scope="col">${di.Clarity}$</th>
            <th scope="col">${di.Price}$</th>
            <th scope="col">${di.Certification}$</th>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination-menu :showX="state.showX" />
  </div>

  <Transition name="modalFade">
    <details-modal :diamond="state.diamondDetails" v-if="showModal" />
  </Transition>
</template>


<script>
import { computed, reactive } from "vue";
import { watchEffect } from "vue";
import { AppState } from "../AppState";
import PaginationMenu from "./PaginationMenu.vue";
import DetailsModal from "./DetailsModal.vue";
import { diamondsService } from "../services/DiamondsService";
import Dropdown from "./DropdownMenu.vue";
export default {
  components: { PaginationMenu, DetailsModal, Dropdown },
  setup() {
    const state = reactive({
      showX: 20,
      sortBy: "",
      sortReverse: false,
      diamondDetails: {},
    });

    watchEffect(() => {
      console.log(state.showX);
      if (AppState.makeRequest) {
        AppState.makeRequest = false;
        if (AppState.timeoutID) {
          clearTimeout(AppState.timeoutID);
          AppState.timeoutID = undefined;
        }
        AppState.timeoutID = setTimeout(async () => {
          AppState.timeoutID = undefined;
          console.log("sending");
          await diamondsService.getDiamondsByQuery();
        }, 1000);
      }
    });

    // Logic which determines the number of pages that can be displayed without another request, and logic which determines the portion of the state data to display based on the viewer's selected page.
    watchEffect(() => {
      if (AppState.diamonds.length && AppState.loaded) {
        const availableDisplayPages = Math.ceil(
          AppState.diamonds.length / state.showX
        );

        AppState.workingSection =
          AppState.displayPage % availableDisplayPages !== 0
            ? AppState.displayPage % availableDisplayPages
            : availableDisplayPages;

        AppState.displayDiamonds = AppState.diamonds.slice(
          state.showX * (AppState.workingSection - 1),
          state.showX * AppState.workingSection
        );
      }
    });

    function popModal(serialNumber) {
      const diamond = [...AppState.diamonds].slice().find((d) => {
        return d.SerialNumber == serialNumber;
      });
      if (state.diamondDetails == diamond) {
        AppState.showModal = true;
      } else {
        diamond.Price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: diamond.CurrencyCode,
        }).format(diamond.Price);
        state.diamondDetails = diamond;
      }
      AppState.showModal = true;

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
    }

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
      loaded: computed(() => AppState.loaded),
      showModal: computed(() => AppState.showModal),
      sortItems,
      popModal,
    };
  },
};
</script>


<style lang="scss" scoped>
$bg-light: white;

.modalFade-enter-active,
.modalFade-leave-active {
  transition: opacity 0.5s ease;
}

.modalFade-enter-from,
.modalFade-leave-to {
  opacity: 0;
}

.section__index {
  margin-top: 1rem;
  margin-bottom: 5rem;
}

table {
  width: 100%;
}

th {
  text-align: start;
}

.sortButton {
  background-color: $bg-light;
}

.sortButton:hover,
tbody > tr:hover {
  cursor: pointer;
  background: darken($bg-light, 10);
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}
</style>