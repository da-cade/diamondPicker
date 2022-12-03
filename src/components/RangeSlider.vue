<template>
  <div v-if="filter.labels.length" class="range_container">
    <div class="sliders_control filter-item">
      <label for="fromSlider">${filter.handle}$</label>
      <input
        id="fromSlider"
        v-model="state.fromVal"
        type="range"
        :min="filter.min"
        :max="filter.max"
        @change="$emit('updateRange', filter.handle, 'fromVal', state.fromVal)"
      />
      <input
        id="toSlider"
        v-model="state.toVal"
        type="range"
        :style="{
          background: sliderBackgroundGradient,
          zIndex: state.toVal <= 0 ? 2 : 0,
        }"
        :min="filter.min"
        :max="filter.max"
        @change="$emit('updateRange', filter.handle, 'toVal', state.toVal)"
      />
      <datalist id="toSlider">
        <option
          v-for="(label, i) in filter.labels"
          :key="label"
          :value="i"
          :label="label"
        ></option>
      </datalist>
    </div>
  </div>
  <div v-else class="range_container">
    <div class="sliders_control">
      <label for="fromSlider">${filter.handle}$</label>
      <input
        :id="state.handle + '-fromSlider'"
        v-model="state.fromVal"
        type="range"
        :min="filter.min"
        :max="filter.max"
        @change="$emit('updateRange', filter.handle, 'fromVal', state.fromVal)"
        class="fromSlider"
      />
      <input
        :id="state.handle + '-toSlider'"
        v-model="state.toVal"
        type="range"
        :style="{
          background: sliderBackgroundGradient,
          zIndex: state.toVal <= 0 ? 2 : 0,
        }"
        :min="filter.min"
        :max="filter.max"
        @change="$emit('updateRange', filter.handle, 'toVal', state.toVal)"
        class="toSlider"
      />
      <datalist :id="state.handle + '-toSlider'">
        <option
          v-for="(label, i) in filter.labels"
          :key="label"
          :value="i"
          :label="label"
        ></option>
      </datalist>
    </div>
    <span> ${ state.fromVal }$ ${ state.toVal }$</span>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from "@vue/runtime-core";
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

    const sliderBackgroundGradient = computed(() => {
      const rangeDistance = props.filter.max - props.filter.min;
      const fromPosition = state.fromVal - props.filter.min;
      const toPosition = state.toVal - props.filter.min;
      const output = `linear-gradient(
      to right,
      ${props.sliderColor} 0%,
      ${props.sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${props.rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${props.rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${props.sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${props.sliderColor} 100%)`;

      return output;
    });

    onMounted(() => {
      state.fromVal = props.filter.min;
      state.toVal = props.filter.max;
    });

    return {
      state,
      sliderBackgroundGradient,
    };
  },
};
</script>

<style scoped>
.filter-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 2rem;
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

.fromSlider {
  height: 0;
  z-index: 1;
}

datalist {
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  width: 80%;
}
</style>