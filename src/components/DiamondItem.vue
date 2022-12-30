<template>
  <tr @click="$emit('showModal')">
    <th scope="col">
      ${diamond.Shape == 'SQUARE' ? 'Princess' : diamond.Shape}$
    </th>
    <th scope="col">${diamond.Size}$</th>
    <th scope="col">${diamond.Cut}$</th>
    <th scope="col">${diamond.Color}$</th>
    <th scope="col">${diamond.Clarity}$</th>
    <th scope="col">${diamond.Price}$</th>
    <th scope="col">${diamond.Certification}$</th>
  </tr>
</template>


<script>
export default {
  props: {
    diamond: {
      type: Object,
      required: true,
    },
  },
  emits: ["showModal"],
  setup() {
    return {};
  },
};
</script>


<style lang="scss" scoped>
th {
  text-align: start;
}

tr:nth-child(odd) {
  background-color: white;
}
tr:nth-child(even) {
  background-color: rgb(242, 242, 242);
}

tbody tr:hover {
  cursor: pointer;
  background: darken(#ffe2d8, 3);
}
</style>