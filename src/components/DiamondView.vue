<template>
  <div class="section__body container-fluid mt-5">
    <div class="section__showX">
      <dropdown :showX="state.showX" @show-x="(i) => (state.showX = i)" />
    </div>
    <div v-if="!loaded" class="loader">Loading</div>
    <div v-else class="section__index">
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="sortButton" @click="sortItems('Shape')">
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
            <th
              scope="col"
              class="sortButton"
              @click="sortItems('Certification')"
            >
              <span>Lab <i></i></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <diamond-item
            v-for="di in displayDiamonds"
            :key="di.SerialNumber"
            :diamond="di"
            @showModal="popModal(di)"
          />
        </tbody>
      </table>
    </div>
    <pagination-menu :showX="state.showX" />
  </div>

  <Transition name="modalFade">
    <details-modal
      :diamond="state.diamondDetails"
      @closeModal="() => (state.showModal = false)"
      v-if="state.showModal"
    />
  </Transition>
</template>


<script>
import { computed, reactive } from "vue";
import { watchEffect } from "vue";
import { AppState } from "../AppState";
import { diamondsService } from "../services/DiamondsService";
import { TemplateData } from "../assets/TemplateData";
import PaginationMenu from "./PaginationMenu.vue";
import Dropdown from "./DropdownMenu.vue";
import DiamondItem from "./DiamondItem.vue";
import DetailsModal from "./DetailsModal.vue";
export default {
  components: { PaginationMenu, Dropdown, DiamondItem, DetailsModal },
  setup() {
    const state = reactive({
      showX: 20,
      sortBy: "Size",
      sortReverse: false,
      showModal: false,
      diamondDetails: {},
    });

    watchEffect(() => {
      if (AppState.makeRequest) {
        AppState.makeRequest = false;
        if (AppState.timeoutID) {
          clearTimeout(AppState.timeoutID);
          AppState.timeoutID = undefined;
        }
        AppState.timeoutID = setTimeout(async () => {
          AppState.timeoutID = undefined;
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

    function sortItems(sortValue) {
      if (AppState.diamonds.length) {
        console.log(sortValue);
        if (sortValue == "Cut" || sortValue == "Clarity") {
          const sortArray = TemplateData.filterLabels[sortValue].labels;
          AppState.diamonds.sort(
            (a, b) =>
              sortArray.indexOf(a[sortValue]) - sortArray.indexOf(b[sortValue])
          );
        } else if (sortValue == "Price" || sortValue == "Size") {
          AppState.diamonds.sort((a, b) => +b[sortValue] - +a[sortValue]);
        } else {
          AppState.diamonds.sort((a, b) =>
            a[sortValue].localeCompare(b[sortValue])
          );
        }
      }
      if (state.sortBy == sortValue) {
        if (state.sortReverse) {
          state.sortReverse = false;
          state.sortBy = "Size";
          AppState.diamonds.sort((a, b) => +b.Size - +a.Size);
        } else {
          state.sortReverse = true;
          AppState.diamonds.reverse();
        }
        console.log(sortValue, state.sortBy, state.sortReverse);
        return;
      }
      state.sortBy = sortValue;
    }

    function popModal(diamond) {
      state.diamondDetails = diamond;
      state.showModal = true;

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
    }

    return {
      state,
      displayDiamonds: computed(() => AppState.displayDiamonds),
      loaded: computed(() => AppState.loaded),
      sortItems,
      popModal,
    };
  },
};
</script>


<style lang="scss" scoped>
.modalFade-enter-active,
.modalFade-leave-active {
  transition: opacity 0.5s ease;
}

.modalFade-enter-from,
.modalFade-leave-to {
  opacity: 0;
}

.section__index {
  margin-bottom: 5rem;
}

table {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background: white;
  width: 100%;
}

thead th {
  text-align: start;
}

.sortButton {
  background-color: #ffe2d8;
  width: 14.29%;
}

.sortButton:hover {
  cursor: pointer;
  background: darken(#ffe2d8, 3);
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}
</style>