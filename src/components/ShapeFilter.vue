<template>
  <div class="gem-buttons">
    <div
      v-for="shape in shapes.values"
      :key="shape"
      :class="state.Shape.includes(shape) ? 'checked' : 'unchecked'"
      class="gem-input"
    >
      <!-- NOTE bs5 (checkbox)-->
      <input
        :checked="state.Shape.includes(shape)"
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
</template>


<script>
import { reactive } from "vue";
import { computed } from "vue";
import { TemplateData } from "../assets/TemplateData";
import { AppState } from "../AppState";
export default {
  setup() {
    const state = reactive({
      Shape: [
        "Round",
        "Square",
        "Oval",
        "Marquise",
        "Emerald",
        "Heart",
        "Pear",
        "Trillion",
        "Radiant",
        "Cushion",
        "Asscher",
      ],
    });

    function updateShapes(shapeItem) {
      let index = [...state.Shape];
      if (!index.includes(shapeItem)) {
        index.push(shapeItem);
      } else {
        index = index.filter((s) => s !== shapeItem);
      }
      state.Shape = index;
      AppState.shapes = index;
      AppState.makeRequest = true;
    }
    return { state, updateShapes, shapes: computed(() => TemplateData.Shape) };
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/diashapes-v6.css";

$icon-size: 2.5rem;
$accent-color: rgb(255, 201, 201);

.gem-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
}

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
  width: calc(var(--font-heading-scale) * 4em);
  // width: 5rem;
  i,
  input {
    font-size: calc(var(--font-heading-scale) * 3em);
    // font-size: 3rem;
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
    transition: transform 50ms linear;
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