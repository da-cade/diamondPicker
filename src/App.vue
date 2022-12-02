    
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
        <!-- PriceRange -->
        <div class="filter-item">
          <label for="price_filter">Price</label>
          <input
            @change="updateDiamonds('PriceRange')"
            v-model="filterValues.PriceRange.max"
            type="range"
            :min="filterLabels.PriceRange.floor"
            :max="filterLabels.PriceRange.ceil"
            name="price_filter"
            list="priceList"
            step="10"
          />
          <datalist id="priceList">
            <option :value="filterLabels.PriceRange.values[0]">
              ${filterLabels.PriceRange.values[0]}$
            </option>
            <option :value="filterLabels.PriceRange.values[1]">
              ${filterLabels.PriceRange.values[1]}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- SizeRange -->
        <div class="filter-item">
          <label for="carat_filter">Carat</label>
          <input
            @change="updateDiamonds('Carat')"
            v-model="filterValues.SizeRange.max"
            type="range"
            :min="filterLabels.SizeRange.floor"
            :max="filterLabels.SizeRange.ceil"
            name="carat_filter"
            list="caratList"
            step="0.1"
          />
          <datalist id="caratList">
            <option :value="filterLabels.SizeRange.floor">
              ${filterLabels.SizeRange.floor}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.25">
              ${filterLabels.SizeRange.ceil * 0.25}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.5">
              ${filterLabels.SizeRange.ceil * 0.5}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.75">
              ${filterLabels.SizeRange.ceil * 0.75}$
            </option>
            <option :value="filterLabels.SizeRange.ceil">
              ${filterLabels.SizeRange.ceil + '.0'}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Cut -->
        <div class="filter-item">
          <label for="cut_filter">Cut</label>
          <input
            @change="updateDiamonds('Cut')"
            v-model="filterValues.Cut.max"
            type="range"
            :min="filterLabels.Cut.floor"
            :max="filterLabels.Cut.ceil"
            name="cut_filter"
            list="cutList"
          />
          <datalist id="cutList">
            <option
              v-for="(s, i) in filterLabels.Cut.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Color -->
        <div class="filter-item">
          <label for="color_filter">Color</label>
          <input
            @change="updateDiamonds('Color')"
            v-model="filterValues.Color.max"
            type="range"
            :min="filterLabels.Color.floor"
            :max="filterLabels.Color.ceil"
            name="color_filter"
            list="colorList"
          />
          <datalist id="colorList">
            <option
              v-for="(s, i) in filterLabels.Color.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Clarity -->
        <div class="filter-item">
          <label for="clarity_filter">Clarity</label>
          <input
            @change="updateDiamonds('Clarity')"
            v-model="filterValues.Clarity.max"
            type="range"
            :min="filterLabels.Clarity.floor"
            :max="filterLabels.Clarity.ceil"
            name="clarity_filter"
            list="clarityList"
          />
          <datalist id="clarityList">
            <option
              v-for="(s, i) in filterLabels.Clarity.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Polish -->
        <div class="filter-item">
          <label for="polish_filter">Polish</label>
          <input
            @change="updateDiamonds('Polish')"
            v-model="filterValues.Polish.max"
            type="range"
            :min="filterLabels.Polish.floor"
            :max="filterLabels.Polish.ceil"
            name="polish_filter"
            list="polishList"
          />
          <datalist id="polishList">
            <option
              v-for="(s, i) in filterLabels.Polish.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Symmetry -->
        <div class="filter-item">
          <label for="symmetry_filter">Symmetry</label>
          <input
            @change="updateDiamonds('Symmetry')"
            v-model="filterValues.Symmetry.max"
            type="range"
            :min="filterLabels.Symmetry.floor"
            :max="filterLabels.Symmetry.ceil"
            name="symmetry_filter"
            list="symmetryList"
          />
          <datalist id="symmetryList">
            <option
              v-for="(s, i) in filterLabels.Symmetry.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Fluorescence -->
        <div class="filter-item">
          <label for="fluor_filter">Fluorescence</label>
          <input
            @change="updateDiamonds('Fluorescence')"
            v-model="filterValues.Fluorescence.max"
            type="range"
            :min="filterLabels.Fluorescence.floor"
            :max="filterLabels.Fluorescence.ceil"
            name="fluor_filter"
            list="fluorList"
          />
          <datalist id="fluorList">
            <option
              v-for="(s, i) in filterLabels.Fluorescence.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- L/w Ratio -->
        <div class="filter-item">
          <label for="lwr_filter">Length/Width Ratio</label>
          <input
            @change="updateDiamonds('LengthToWidthRatio')"
            v-model="filterValues.LengthToWidthRatio.max"
            type="range"
            :min="filterLabels.LengthToWidthRatio.floor"
            :max="filterLabels.LengthToWidthRatio.ceil"
            name="lwr_filter"
            list="lwrList"
            step="0.1"
          />
          <datalist id="lwrList">
            <option :value="filterLabels.LengthToWidthRatio.floor">
              ${filterLabels.LengthToWidthRatio.floor}$
            </option>
            <option value="1.0">1.0</option>
            <option value="2.0">2.0</option>
            <option :value="filterLabels.LengthToWidthRatio.ceil">
              ${filterLabels.LengthToWidthRatio.ceil + '.0'}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Table % -->
        <div class="filter-item">
          <label for="table_filter">Table Percentage</label>
          <input
            @change="updateDiamonds('TablePercent')"
            v-model="filterValues.TablePercent.max"
            type="range"
            :min="filterLabels.TablePercent.floor"
            :max="filterLabels.TablePercent.ceil"
            name="table_filter"
            list="tableList"
            step="1"
          />
          <datalist id="tableList">
            <option value="0.1">${filterLabels.TablePercent.floor}$</option>
            <option value="50">${filterLabels.TablePercent.ceil/2}$</option>
            <option value="100">${filterLabels.TablePercent.ceil}$</option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Depth % -->
        <div class="filter-item">
          <label for="depth_filter">Depth Percentage</label>
          <input
            @change="updateDiamonds('DepthPercent')"
            v-model="filterValues.DepthPercent.max"
            type="range"
            :min="filterLabels.DepthPercent.floor"
            :max="filterLabels.DepthPercent.ceil"
            name="depth_filter"
            list="depthList"
            step="1"
          />
          <datalist id="depthList">
            <option value="0.1">${filterLabels.DepthPercent.floor}$</option>
            <option value="50">${filterLabels.DepthPercent.ceil/2}$</option>
            <option value="100">${filterLabels.DepthPercent.ceil}$</option>
          </datalist>
        </div>
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
import { AppState } from "./services/AppState";
import { TemplateData } from "./assets/TemplateData";
export default {
  components: { DetailsModal, SideDetails },
  setup() {
    const state = reactive({
      loaded: false,
      showX: 20,
      sortBy: "",
      sortReverse: false,
      timeoutID: undefined,
    });
    const filterValues = ref(
      JSON.parse(JSON.stringify(TemplateData.filterLabels))
    );
    const displayDiamonds = ref([]);

    const handleTimer = {
      async sendUpdates() {
        state.timeoutID = undefined;
      },
      setup() {
        if (typeof state.timeoutID === "number") {
          this.cancel();
        }
        state.timeoutID = setTimeout(() => {
          this.sendUpdates();
        }, 1000);
      },
      cancel() {
        clearTimeout(state.timeoutID);
      },
    };

    watchEffect(async () => {
      if (
        filterValues.value != undefined &&
        typeof state.timeoutID !== "number"
      ) {
        await requestUpdates();
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

    function updateShapes(shapeItem) {
      state.loaded = false;
      let index = filterValues.value.Shape.values;
      if (!index.includes(shapeItem)) {
        index.push(shapeItem);
      } else {
        index = index.filter((s) => s !== shapeItem);
      }
      filterValues.value.Shape.values = index;
      handleTimer.setup();
    }

    function updateDiamonds(update) {
      try {
        let templateIndex = TemplateData.filterLabels[update];
        let reactiveIndex = filterValues.value[update];
        if (!AppState.intFilters.includes(update)) {
          reactiveIndex.values = [
            templateIndex.values.slice(+reactiveIndex.min, +reactiveIndex.max),
          ];
        } else {
          reactiveIndex.values = [+reactiveIndex.min, +reactiveIndex.max];
        }
        requestUpdates();
        state.loaded = true;
      } catch (error) {
        console.log(error);
      }
    }

    async function requestUpdates() {
      try {
        const formData = {};
        const element = { ...filterValues.value };
        for (const key in element) {
          formData[key] = element[key].values;
        }
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

.col-4 > div {
  /* margin-top: 2rem; */
}

.filter-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
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
