<template>
  <div v-if="filter.labels" class="range_container p-3">
    <div class="sliders_control filter-item">
      <label for="fromSlider">${filter.handle}$</label>
      <input
        :id="filter.handle + '-fromSlider'"
        v-model="state.fromVal"
        type="range"
        :min="filter.min"
        :max="filter.max"
        @change="updateDiamonds(filter.title, 'fromVal', state.fromVal)"
        class="fromSlider"
        style="height: 0; z-index: 1"
      />
      <input
        :id="filter.handle + '-toSlider'"
        v-model="state.toVal"
        type="range"
        :style="{
          background: sliderBackgroundGradient,
          zIndex: state.toVal <= 0 ? 2 : 0,
        }"
        :min="filter.min"
        :max="filter.max"
        @change="updateDiamonds(filter.title, 'toVal', state.toVal)"
        class="toSlider"
      />
      <datalist :id="filter.handle + '-toSlider'">
        <option
          :style="computeWidth"
          v-for="(label, i) in filter.labels"
          :key="label"
          :value="i"
          :label="label"
        ></option>
      </datalist>
    </div>
  </div>
  <div v-else class="range_container p-3">
    <div class="sliders_control filter-item">
      <label for="fromSlider">${filter.handle}$</label>
      <input
        :id="filter.handle + '-fromSlider'"
        v-model="state.fromVal"
        type="range"
        :min="filter.min"
        :max="filter.max"
        :step="step"
        @change="updateDiamonds(filter.title, 'fromVal', state.fromVal)"
        class="fromSlider"
        style="height: 0; z-index: 1"
      />
      <input
        :id="filter.handle + '-toSlider'"
        v-model="state.toVal"
        type="range"
        :style="{
          background: sliderBackgroundGradient,
          zIndex: state.toVal <= 0 ? 2 : 0,
        }"
        :min="filter.min"
        :max="filter.max"
        :step="step"
        @change="updateDiamonds(filter.title, 'toVal', state.toVal)"
        class="toSlider"
      />
      <datalist :id="filter.handle + '-toSlider'">
        <option
          v-for="(label, i) in options"
          :key="label"
          :value="i"
          :label="label"
        ></option>
      </datalist>
    </div>
    <div class="num-inputs-container">
      <input
        type="number"
        name="ending-value"
        v-model="state.fromVal"
        :min="filter.min"
        :max="filter.max"
        :step="step"
        id="ending-val-input"
      />
      <input
        type="number"
        name="starting-value"
        v-model="state.toVal"
        :min="filter.min"
        :max="filter.max"
        :step="step"
        id="starting-val-input"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, watch } from "vue";
import { AppState } from "../AppState";
import { TemplateData } from "../assets/TemplateData";
export default {
  emits: ["updateRange"],
  props: {
    filter: { type: Object, required: true },
    sliderColor: { type: String, default: "#C6C6C6" },
    rangeColor: { type: String, default: "#338CFF" },
  },
  setup(props) {
    const state = reactive({
      fromVal: null,
      toVal: null,
    });

    onMounted(() => {
      state.fromVal = props.filter.min;
      state.toVal = props.filter.max;
    });

    const step = computed(() => {
      return props.filter.min < 1 ? ".1" : "1";
    });

    const computeWidth = computed(() => {
      const width = Math.floor((1 / props.filter.labels.length) * 100);
      return `width: ${width}%`;
    });

    const options = computed(() => {
      const values = 4;
      let output = [(+props.filter.min).toLocaleString()];
      for (let i = 1; i <= values; i++) {
        output.push((+props.filter.max * 0.25 * i).toLocaleString());
      }
      return output;
    });

    const sliderBackgroundGradient = computed(() => {
      const rangeDistance = props.filter.max - props.filter.min;
      const fromPosition = state.fromVal - props.filter.min;
      const toPosition = state.toVal - props.filter.min;
      return `linear-gradient(
      to right,
      ${props.sliderColor} 0%,
      ${props.sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${props.rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${props.rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${props.sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${props.sliderColor} 100%)`;
    });

    watch(
      () => ({ ...state }),
      (value, oldValue) => {
        if (oldValue.fromVal) {
          if (+value.fromVal > +value.toVal && value.toVal === oldValue.toVal) {
            state.fromVal = state.toVal;
          }
          if (
            +value.toVal < +value.fromVal &&
            value.fromVal === oldValue.fromVal
          ) {
            state.toVal = state.fromVal;
          }
        }
      }
    );

    function updateDiamonds(filter, rangeValue, update) {
      AppState.filterValues[filter][rangeValue] = +update;
      let reactiveIndex = AppState.filterValues[filter];
      if (!TemplateData.intFilters.includes(filter)) {
        reactiveIndex.values = reactiveIndex.labels.slice(
          +reactiveIndex.fromVal,
          +reactiveIndex.toVal
        );
      } else {
        reactiveIndex.values = [+reactiveIndex.fromVal, +reactiveIndex.toVal];
      }
      console.log(AppState.filterValues[filter].values);
      AppState.makeRequest = true;
    }

    return {
      state,
      step,
      options,
      computeWidth,
      sliderBackgroundGradient,
      updateDiamonds,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.filter-item > label {
  padding-bottom: 1.5rem;
}

.sliders_control {
  position: relative;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #c6c6c6;
  cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #c6c6c6;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb:hover {
  background: #f7f7f7;
}
input[type="range"]::-webkit-slider-thumb:active {
  box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  width: 100%;
  position: absolute;
  background-color: #c6c6c6;
  pointer-events: none;
}

.num-inputs-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  input[type="number"] {
    width: 15%;
  }
}

datalist {
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  width: 100%;
}

option {
  display: flex;
  justify-content: center;
}
</style>