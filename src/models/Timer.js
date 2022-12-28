export class Timer {

  // check to see if a timer already exists
  // if it does, cancel it and reset the timer
  // at the end, send a request.

  constructor(ms, fn) {
    this.sendRequest = false
    if (this.timeoutID) {
      this.timeoutID = undefined
      this.cancel()
    } else {
      this.timeoutID = setInterval(() => {
        this.timeoutID = undefined
        this.sendRequest = true
        this.resolve(fn)
      }, ms)
    }
  }

  cancel() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID)
      this.timeoutID = undefined
      this.sendRequest = false
    }
  }
}
  // constructor(ms) {
  //   this.resolved = false
  //   this.handle = setTimeout(() => {
  //     this.handle = undefined
  //     this.resolved = true
  //     if (this.resolve) {
  //       this.resolve()
  //       this.resolve = undefined
  //     }
  //   }, ms)
  // }
  // cancel() {
  //   if (this.handle) {
  //     this.handle = undefined
  //     this.resolve = undefined
  //   }
  // }

  // then(resolve, reject) {
  //   if (this.resolved || !this.handle) {
  //     resolve()
  //   } else {
  //     this.resolve = resolve
  //   }
  //   this.handle = undefined
  // }
}