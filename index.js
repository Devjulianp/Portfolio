// Section carrousel

var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
    },
});

// Section Typejs

var typed = new Typed('#typejs', {
    strings: ["Soy Ingeniero Industrial", "Soy Web Developer!"],
    typeSpeed: 70
});

var scene = new THREE.Scene();
document.addEventListener('mousemove', onMouseMove, false);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var mouseX;
var mouseY;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

var distance = Math.min(200, window.innerWidth / 4);
var geometry = new THREE.Geometry();

for (var i = 0; i < 1600; i++) {

    var vertex = new THREE.Vector3();

    // var theta = THREE.Math.randFloatSpread(360); 
    var theta = Math.acos(THREE.Math.randFloatSpread(2));
    var phi = THREE.Math.randFloatSpread(360);

    vertex.x = distance * Math.sin(theta) * Math.cos(phi);
    vertex.y = distance * Math.sin(theta) * Math.sin(phi);
    vertex.z = distance * Math.cos(theta);

    geometry.vertices.push(vertex);
}
var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xff44ff,
    size: 2
}));
particles.boundingSphere = 50;


var renderingParent = new THREE.Group();
renderingParent.add(particles);

var resizeContainer = new THREE.Group();
resizeContainer.add(renderingParent);
scene.add(resizeContainer);

camera.position.z = 400;

var animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
var myTween;

function onMouseMove(event) {
    if (myTween)
        myTween.kill();

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    myTween = gsap.to(particles.rotation, {
        duration: 0.1,
        x: mouseY * -1,
        y: mouseX
    });
    //particles.rotation.x = mouseY*-1;
    //particles.rotation.y = mouseX;
}
animate();

// Scaling animation
var animProps = {
    scale: 1,
    xRot: 0,
    yRot: 0
};
gsap.to(animProps, {
    duration: 10,
    scale: 1.3,
    repeat: -1,
    yoyo: true,
    ease: "sine",
    onUpdate: function () {
        renderingParent.scale.set(animProps.scale, animProps.scale, animProps.scale);
    }
});

gsap.to(animProps, {
    duration: 120,
    xRot: Math.PI * 2,
    yRot: Math.PI * 4,
    repeat: -1,
    yoyo: true,
    ease: "none",
    onUpdate: function () {
        renderingParent.rotation.set(animProps.xRot, animProps.yRot, 0);
    }
});

// Section Carrousel eliptico

const container = document.querySelector(".skill");
const containerCarrousel = container.querySelector(".container-carrousel");
const carrousel = container.querySelector(".carrousel");
const carrouselItems = carrousel.querySelectorAll(".carrousel-item");

// Iniciamos variables que cambiaran su estado.
let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createCarrousel = () => {
    const carrouselProps = onResize();
    const length = carrouselItems.length; // Longitud del array
    const degress = 360 / length; // Grados por cada item
    const gap = 0; // Espacio entre cada item
    const tz = distanceZ(carrouselProps.w, length, gap)

    const fov = calculateFov(carrouselProps);
    const height = calculateHeight(tz);

    container.style.width = tz * 3 + gap * length + "px";
    container.style.height = height + "px";

    carrouselItems.forEach((item, i) => {
        const degressByItem = degress * i + "deg";
        item.style.setProperty("--rotatey", degressByItem);
        item.style.setProperty("--tz", tz + "px");
    });
};

// Funcion que da suavidad a la animacion
const lerp = (a, b, n) => {
    return n * (a - b) + b;
};

// https://3dtransforms.desandro.com/carousel
const distanceZ = (widthElement, length, gap) => {
    return (widthElement / 2) / Math.tan(Math.PI / length) + gap; // Distancia Z de los items
}

// Calcula el alto del contenedor usando el campo de vision y la distancia de la perspectiva
const calculateHeight = z => {
    const t = Math.atan(90 * Math.PI / 180 / 2);
    const height = t * 2 * z;

    return height;
};

// Calcula el campo de vision del carrousel
const calculateFov = carrouselProps => {
    const perspective = window
        .getComputedStyle(containerCarrousel)
        .perspective.split("px")[0];

    const length =
        Math.sqrt(carrouselProps.w * carrouselProps.w) +
        Math.sqrt(carrouselProps.h * carrouselProps.h);
    const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
    return fov;
};

// Obtiene la posicion X y evalua si la posicion es derecha o izquierda
const getPosX = x => {
    currentMousePos = x;

    moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;

    lastMousePos = currentMousePos;
};

const update = () => {
    lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
    carrousel.style.setProperty("--rotatey", lastMoveTo + "deg");

    requestAnimationFrame(update);
};

const onResize = () => {
    // Obtiene la propiedades del tamaño de carrousel
    const boundingCarrousel = containerCarrousel.getBoundingClientRect();

    const carrouselProps = {
        w: boundingCarrousel.width,
        h: boundingCarrousel.height
    };

    return carrouselProps;
};

const initEvents = () => {
    // Eventos del mouse
    carrousel.addEventListener("mousedown", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener("mouseleave", () => (isMouseDown = false));

    carrousel.addEventListener(
        "mousemove",
        e => isMouseDown && getPosX(e.clientX)
    );

    // Eventos del touch
    carrousel.addEventListener("touchstart", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("touchend", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener(
        "touchmove",
        e => isMouseDown && getPosX(e.touches[0].clientX)
    );

    window.addEventListener("resize", createCarrousel);

    update();
    createCarrousel();
};

initEvents();