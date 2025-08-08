const imagesToLoad = document.querySelectorAll('img[data-src]');

const loadImages = (image) => {
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = () => {
        image.removeAttribute('data-src');
    };
};

export function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((items, observer) => {
            items.forEach((item) => {
                if (item.isIntersecting) {
                    loadImages(item.target);
                    observer.unobserve(item.target);
                }
            });
        });

        imagesToLoad.forEach((img) => {
            observer.observe(img);
        });
    } else {
        // Fallback for older browsers
        imagesToLoad.forEach((img) => {
            loadImages(img);
        });
    }
}