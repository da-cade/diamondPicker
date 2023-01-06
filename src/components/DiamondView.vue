<template>
  <div class="section__body container-fluid mt-5">
    <div class="section__showX">
      <dropdown :showX="state.showX" @show-x="(i) => (state.showX = i)" />
    </div>
    <div v-if="!loaded" class="loader">Loading</div>
    <div v-else-if="!displayDiamonds.length" class="no-diamonds">
      <h3>
        There aren't any diamonds that match these search terms right now.
        <i></i>
      </h3>
    </div>
    <div v-else class="section__index">
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="sortButton" @click="sortItems('Shape')">
              <span>Shape </span>
              <i v-if="state.sortBy == 'Shape'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Size')">
              <span>Carat </span>
              <i v-if="state.sortBy == 'Size'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Cut')">
              <span>Cut </span>
              <i v-if="state.sortBy == 'Cut'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Color')">
              <span>Color </span>
              <i v-if="state.sortBy == 'Color'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Clarity')">
              <span>Clarity </span>
              <i v-if="state.sortBy == 'Clarity'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th scope="col" class="sortButton" @click="sortItems('Price')">
              <span>Price </span>
              <i v-if="state.sortBy == 'Price'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
            </th>
            <th
              scope="col"
              class="sortButton"
              @click="sortItems('Certification')"
            >
              <span>Lab</span>
              <i v-if="state.sortBy == 'Certification'"
                ><svg
                  class="header-icon"
                  :class="{ rotate: state.sortReverse }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  /></svg
              ></i>
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
          AppState.buildWheel = true;
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
        if (sortValue == "Cut" || sortValue == "Clarity") {
          const sortArray = TemplateData.filterLabels[sortValue].labels;
          AppState.diamonds.sort(
            (a, b) =>
              sortArray.indexOf(b[sortValue]) - sortArray.indexOf(a[sortValue])
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

th i {
  display: inline-flex;
  position: absolute;
  justify-content: center;
  align-content: center;
  right: 2px;
  .header-icon {
    width: 1rem;
    transform: rotate(0deg);
    transition-duration: 0.3s;
  }

  .header-icon.rotate {
    transform: rotate(-180deg);
    transition-duration: 0.3s;
  }
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

.no-diamonds {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}
</style>