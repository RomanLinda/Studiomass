//SCRIPT HOMEPAGE
//Slide picture
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
const interval = 5000;
let timer = setInterval(showNextSlide, interval);

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function showNextSlide() {
  let nextIndex = (currentIndex + 1) % slides.length;
  showSlide(nextIndex);
}

function showPrevSlide() {
  let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

// Event listeners
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(timer);
    const index = parseInt(dot.getAttribute('data-index'));
    showSlide(index);
    timer = setInterval(showNextSlide, interval);
  });
});


document.querySelector('.slider').addEventListener('mouseenter', () => {
  clearInterval(timer);
});
document.querySelector('.slider').addEventListener('mouseleave', () => {
  timer = setInterval(showNextSlide, interval);
}); //pause sliding when cursor on the image

let startX = 0; //Allow mobile users to slide with a finger swipe

document.querySelector('.slider').addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

document.querySelector('.slider').addEventListener('touchend', (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) showNextSlide(); // swipe left
  else if (endX - startX > 50) showPrevSlide(); // swipe right
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showNextSlide();
  if (e.key === 'ArrowLeft') showPrevSlide();
}); //Keep things accessible with left/right arrow keys
//Slide pic End

//Two Column script
const columns = document.querySelectorAll('.column');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // optional: animate only once
      }
    });
  }, {
    threshold: 0.2
  });

columns.forEach(column => observer.observe(column));
//Two Column End
//SCRIPT HOMEPAGE END


