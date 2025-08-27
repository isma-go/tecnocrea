// horizontal Scroll

const horizontalScroll = document.querySelector('.horizontal-scroll');
const scrollTrack = document.querySelector('.scroll-track');

window.addEventListener('scroll', () => {
    const sectionTop = horizontalScroll.offsetTop;
    const scrollY = window.scrollY;
    const sectionHeight = horizontalScroll.offsetHeight;
    const scrollDistance = scrollY - sectionTop;

    if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
    scrollTrack.style.transform = `translateX(-${scrollDistance}px)`;
    }
});

// scroll

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.nav__link');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 70;
        let height = sec.offsetHeight;
        let id = sec.getAttribute ('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.nav__link[href*=' + id + ']').classList.add('active');
            });
        };
    });
};