
class AnimationLib {
  applyAnimation(anim, timing, elems) {
    if (elems[0]) {
      elems.forEach((p) => p.animate(anim, timing));
    } else {
      elems.animate(anim, timing)
    }
  }

  vertSlide(elements, vertDirection) {
    const centerPop =
      vertDirection == -1
        ? [{ transform: "translateY(0)" }, { transform: `translateY(150%)` }]
        : [{ transform: `translateY(150%)` }, { transform: "translateY(0)" }];
    const centerTiming = {
      duration: 250,
      delay: 0,
      fill: "forwards",
      iterations: 1,
      easing: "cubic-bezier(0.6, 0.14, 0.9, 0.55)",
    };

    this.applyAnimation(centerPop, centerTiming, elements)
  }
  animateSlash(elements, horizDirection) {
    const underlineSlash =
      horizDirection == 1
        ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
        : [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }];

    const underlineTiming = {
      fill: "forwards",
      duration: 100,
      delay: horizDirection == -1 ? 0 : 500,
      easing: "linear",
    };

    this.applyAnimation(underlineSlash, underlineTiming, elements)
  }
}

export const animationLib = new AnimationLib;