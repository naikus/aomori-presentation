function Navigator(router, slides) {
  let current = 0;
  return {
    next() {
      current = (current + 1) % slides.length;
      // This is to handle back and forward button clidks
      // console.log(slides[current], router.getCurrentRoute().path);
      if(slides[current] === router.getCurrentRoute().path) {
        this.next();
        return;
      }
      router.route(slides[current]);
    },
    previous() {
      if(current === 0) {
        return;
      }
      current = current - 1;
      router.back();
    }
  }
}

export default Navigator;