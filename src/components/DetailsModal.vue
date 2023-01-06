<template>
  <div class="modalDialog" ref="dialog">
    <div class="modalContent">
      <div class="modalHeader">
        <div class="buttonBar">
          <button v-if="!mobile" class="close" @click.stop="closeModal()">
            Close
          </button>
          <i v-else @click.stop="closeModal()"
            ><svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path></svg
          ></i>
        </div>
        <div class="modalTitle modalWidth">
          <div class="titleItem">
            <h1>Diamond #${diamond.SerialNumber}$</h1>
            <span class="mt-2">
              Certified By:
              <a :href="diamond.CertificatePath"
                >${diamond.Certification}$</a
              ></span
            >
          </div>
          <div class="titleItem align-items-end">
            <h2 class="text-end">${diamond.Shape}$, ${diamond.Size}$ Carats</h2>
            <span class="text-end mt-2"
              >Price: ${diamond.Price}$ ${diamond.CurrencyCode}$</span
            >
          </div>
        </div>
      </div>
      <div class="modalBody modalWidth row">
        <div class="dia-video col-12 col-md-8">
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
        <div class="dia-info col-12 col-md-4">
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
import { AppState } from "../AppState";
export default {
  props: {
    diamond: {
      type: Object,
      required: true,
    },
  },
  emits: ["inFocus", "closeModal"],
  setup(props, { emit }) {
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
      emit("closeModal");
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
      mobile: computed(AppState.mobile),
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
  width: 100%;
  z-index: 11;
}

// NOTE longer on media
.modalContent {
  position: fixed;
  background-color: white;
  top: 5vh;
  left: 10vw;
  overflow-y: auto;
  overflow-x: hidden;
  width: 80%;
  height: 70%;
  z-index: 20;
}

.modalHeader {
  padding: 10px;
  width: 100%;
}

// NOTE change content to x media
.buttonBar {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 2rem;
  .close {
    margin: 0 0 0 auto;
    background: none;
    border: 2px solid;
    padding: 1em 2em;
    // color: #ff7f82;
    transition: 0.25s;
    &:hover,
    &:focus {
      cursor: pointer;
      border-color: #ff7f82;
      color: #fff;
      box-shadow: inset -3.5em 0 0 0 adjust-hue(#ff7f82, 45deg),
        inset 3.5em 0 0 0 adjust-hue(#ff7f82, 45deg);
    }
  }
  i {
    color: black;
    width: 1.5rem;
  }
}

// NOTE thinner on media
.modalWidth {
  padding: 0 5rem 0 5rem;
}

.modalTitle {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.titleItem {
  display: flex;
  flex-direction: column;
}

// NOTE longer on media
.modalBody {
  height: 50vh;
  margin-top: 30px;
}

.dia-video {
  display: flex;
  justify-content: center;
}

// NOTE full width
#background-video {
  width: 70%;
  // max-height: 80%;
  object-fit: contain;
}

.dia-info {
  padding: 20px;
  margin-top: 30px;
  ul {
    -webkit-column-count: 1;
    column-count: 1;
  }
  li {
    margin-top: 10px;
  }
}

hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>