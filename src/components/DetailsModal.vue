<template>
  <div class="modalDialog page-width" ref="dialog">
    <div class="modalContent">
      <div class="modalHeader">
        <div class="modalTitle">
          <h2>Diamond #${diamond.SerialNumber}$</h2>
          <div class="modalTitle">
            <h2>${diamond.Shape}$, ${diamond.Size}$ Carats</h2>
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
      <i @click.stop="closeModal()"
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
      <div class="modalBody row">
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
export default {
  props: {
    diamond: {
      type: Object,
      required: true,
    },
    showModal: {
      type: Boolean,
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
      closeModal,
    };
  },
};
</script>


<style lang="scss" scoped>
.page-width {
  width: 100vw;
}

.modalDialog {
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.438);
  height: 100vh;
  z-index: 11;
}

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
  i {
    position: absolute;
    top: 5px;
    right: 5px;
    color: black;
    width: 1.5rem;
    svg {
      transition: 0.75s cubic-bezier(0.88, 0.12, 0.35, 0.81);
      transform: rotate(0);
    }
    &:hover {
      cursor: pointer;
      svg {
        transform: rotate(400deg);
      }
    }
  }
}

.modalHeader {
  padding: 30px;
}

.modalTitle {
  display: flex;
  justify-content: space-between;
}

.modalBody {
  height: 50vh;
  margin-top: 30px;
}

.dia-video {
  display: flex;
  justify-content: center;
}

#background-video {
  width: 100%;
  max-height: 100%;
  object-fit: cover;
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