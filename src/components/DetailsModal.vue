<template>
  <div class="modalDialog" ref="dialog">
    <div class="modalContent">
      <div class="modalHeader">
        <div class="modalTitle">
          <h2>Diamond #${diamond.SerialNumber}$</h2>
          <div class="modalTitle">
            <h2>${diamond.Shape}$, ${diamond.Size}$ Carats</h2>
            <i @click.stop="closeModal()">x</i>
          </div>
        </div>
        <div class="modalTitle">
          <span>
            Certified By:
            <a :href="diamond.CertificatePath"
              >${diamond.Certification}$</a
            ></span
          >
          <span>Price: ${diamond.Price}$ ${diamond.CurrencyCode}$</span>
        </div>
      </div>
      <div class="modalBody">
        <div class="dia-video">
          <video
            id="background-video"
            :poster="diamond.Poster"
            muted
            autoplay
            loop
          >
            <source :src="diamond.Video" />
          </video>
        </div>
        <div class="dia-info">
          <h3>More Information</h3>
          <hr />
          <ul>
            <li v-for="(value, key) in infoObj" :key="key">
              ${key}$: ${value}$
              <span v-if="key.includes('Percent')">%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, onMounted, ref } from "vue";
import { AppState } from "../services/AppState";
export default {
  props: {
    diamond: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const infoObj = computed(() => {
      const exceptions = Object.keys(props.diamond).slice(0, 10);
      const reduced = Object.keys(props.diamond)
        .filter((key) => !exceptions.includes(key))
        .reduce((cur, key) => {
          return Object.assign(cur, {
            [key.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")]: props.diamond[key],
          });
        }, {});
      return reduced;
    });
    const dialog = ref();

    function closeModal() {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      AppState.showModal = false;
    }

    onMounted(() => {
      // NOTE is it necessary to remove event listeners for components removed from the dom?
      dialog.value.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      });
    });

    return {
      dialog,
      infoObj,
      showModal: computed(() => AppState.showModal),
      closeModal,
    };
  },
};
</script>


<style lang="scss" scoped>
.modalDialog {
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.438);
  height: 100vh;
  width: 100vw;
  z-index: 11;
}

.modalContent {
  position: fixed;
  background-color: white;
  top: 5vh;
  left: 5vw;
  overflow-y: auto;
  overflow-x: hidden;
  width: 90vw;
  height: 90vh;
  z-index: 20;
}

.modalHeader {
  padding: 30px;
}

.modalTitle {
  display: flex;
  justify-content: space-between;
}

.modalBody {
  margin-top: 30px;
}

.dia-video {
  display: flex;
  justify-content: center;
}

#background-video {
  width: 70%;
  object-fit: cover;
}

.dia-info {
  padding: 30px;
  margin-top: 30px;
  ul {
    -webkit-column-count: 2;
    column-count: 2;
  }
}
</style>