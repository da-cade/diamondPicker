    
    <!-- we need our special diamond filter -->
    <!-- we need pagination -->
      <!-- pagination function -->
    <!-- a diamond item component -- props: diamond object -->
    <!-- a diamond SIDE - details component props: diamond object -->
    <!-- a diamond MODAL - details component props: diamond object -->
    <!-- filter item - range, interval_count, labels (should equal interval_count) -->
<!-- what are we gonna use the style tags for? -->
<!-- can we communicate with the json files in the Theme w/o requesting them? Some things seem to be accessible -->
<!-- so far, we CAN set our own settings. what should they be? -->
<!-- Local settings:  -->
<!-- Imported Settings: Text-color-1, Text-color-2, Light-Background-1, Accent-1, page-width, font -->
<!-- diamond filters -->
<!--  -->



<template>
  <div class="index__content container-fluid" style="width: 100%">
    <div class="section__filters row">
      <div class="col-6 gem-buttons">
        <div
          v-for="shape in filterLabels.Shape.values"
          :key="shape"
          :class="
            filterValues.Shape.values.includes(shape) ? 'checked' : 'unchecked'
          "
          class="gem-input"
        >
          <input
            :checked="filterValues.Shape.values.includes(shape)"
            @change="updateShapes(shape)"
            class="gem-item"
            type="checkbox"
            :name="'shape-box_' + shape"
            :id="'shape-box_' + shape"
          />
          <i :class="'icon dia-' + shape.toLowerCase()"></i>
          <label :for="'dia-' + shape.toLowerCase() + '-button'"
            >${ shape == "Square" ? "Princess" : shape }$</label
          >
        </div>
      </div>
      <div class="col-6">
        <range-slider :filter="filterValues.Cut" @update-range="updateRange">
        </range-slider>
      </div>
    </div>
  </div>
  <div class="section__body mt-5">
    <div class="showX">
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
    <div class="section__index container-fluid">
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
    <div class="side-details">
      <side-details />
    </div>
  </div>

  <details-modal />
</template>

<script>
import { computed, reactive, ref, watchEffect } from "vue";
import { diamondsService } from "../src/services/DiamondsService";
import DetailsModal from "./components/DetailsModal.vue";
import SideDetails from "./components/SideDetails.vue";
import RangeSlider from "./components/RangeSlider.vue";
import { AppState } from "./services/AppState";
import { TemplateData } from "./assets/TemplateData";
export default {
  components: { DetailsModal, SideDetails, RangeSlider },
  setup() {
    const state = reactive({
      loaded: false,
      showX: 20,
      sortBy: "",
      sortReverse: false,
      timeoutID: undefined,
      sendRequest: false,
    });
    const filterValues = ref(
      JSON.parse(JSON.stringify(TemplateData.filterLabels))
    );
    const displayDiamonds = ref([]);

    const handleTimer = {
      passToUpdate(filter) {
        updateDiamonds(filter);
        state.timeoutID = undefined;
      },
      setup(filter) {
        if (typeof state.timeoutID === "number") {
          this.cancel();
        }
        state.timeoutID = setTimeout(() => {
          this.passToUpdate(filter);
        }, 1000);
      },
      cancel() {
        clearTimeout(state.timeoutID);
      },
    };

    watchEffect(async () => {
      if (
        filterValues.value !== undefined &&
        typeof state.timeoutID !== "number"
      ) {
        console.log("it me, watch effect");
        await requestUpdates();
        state.sendRequest = false;
        state.loaded = true;
      }
    });

    watchEffect(() => {
      if (AppState.diamonds.length) {
        displayDiamonds.value = AppState.diamonds.slice(0, state.showX);
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

    function updateRange(filter, rangeValue, update) {
      filterValues.value[filter][rangeValue] = +update;
      handleTimer.setup(filter);
    }

    function updateShapes(shapeItem) {
      state.loaded = false;
      let index = filterValues.value.Shape.values;
      if (!index.includes(shapeItem)) {
        index.push(shapeItem);
      } else {
        index = index.filter((s) => s !== shapeItem);
      }
      filterValues.value.Shape.values = index;
      handleTimer.setup("Shape");
    }

    function updateDiamonds(filter) {
      try {
        let reactiveIndex = filterValues.value[filter];
        if (!AppState.intFilters.includes(filter)) {
          reactiveIndex.values = reactiveIndex.labels.slice(
            +reactiveIndex.fromVal,
            +reactiveIndex.toVal
          );
        } else {
          reactiveIndex.values = [+reactiveIndex.fromVal, +reactiveIndex.toVal];
        }
        state.sendRequest = true;
        state.loaded = true;
      } catch (error) {
        console.log(error);
      }
    }

    async function requestUpdates() {
      try {
        const formData = {};
        const filterData = JSON.parse(JSON.stringify(filterValues.value));
        for (const key in filterData) {
          formData[key] = filterData[key].values;
        }
        console.log(formData);
        await diamondsService.getDiamondsByQuery(formData);
      } catch (error) {
        console.log(error.message);
      }
    }

    return {
      state,
      filterLabels: computed(() => TemplateData.filterLabels),
      filterValues,
      displayDiamonds,
      sortItems,
      updateRange,
      updateShapes,
      updateDiamonds,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./assets/diashapes-v6.css";

.section__filters {
  width: 100%;
  outline: solid;
  outline-color: red;
}
.section__body {
  width: 100%;
  outline: solid;
  outline-color: green;
}

.filter-item > input {
  width: 80%;
}

datalist {
  display: flex;
  justify-content: space-between;
  color: red;
  width: 80%;
}

.gem-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

$icon-size: 2.5rem;
$accent-color: rgb(255, 201, 201);
.gem-input {
  display: flex;
  background-color: white;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 0.3rem;
  border: 1px solid black;
  position: relative;
  height: fit-content;
  z-index: 0;
  transition: transform 150ms ease;
  i,
  input {
    // width: $icon-size;
    // height: $icon-size;
    font-size: $icon-size;
    background-color: transparent;
    z-index: 2;
    pointer-events: auto;
  }
  label {
    font-size: small;
    display: flex;
    z-index: -1;
  }
  i {
    transition: transform 150ms ease;
    transform: scale(1);
    color: black;
    z-index: -1;
  }
  &:hover {
    background-color: darken($accent-color, 1);
    i {
      transform: scale(1.04);
    }
  }
}

.gem-item {
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
}

.unchecked {
  background-color: lighten($accent-color, 6);
  i,
  label {
    color: black;
  }
}

.checked {
  background-color: darken($accent-color, 7);
  i,
  label {
    color: rgb(0, 0, 0);
  }
}
</style>
