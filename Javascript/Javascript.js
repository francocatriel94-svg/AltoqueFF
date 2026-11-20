document.addEventListener('DOMContentLoaded', () => {
    const carruselContenedor = document.getElementById('carrusel-altoque');
    const imgArriba = document.getElementById('carrusel-arriba');
    const imgDebajo = document.getElementById('carrusel-debajo');
    const indicadoresContenedor = document.getElementById('carrusel-indicadores');

    const slides = [
        { src: 'Assets/Hamburguesa.webp', alt: 'Logo y estilo de AlToqueFF' },
        { src: 'Assets/ImagenPizza.jpg', alt: 'Pizzas y hamburguesas al toque en Luján' }
    ];

    if (!carruselContenedor || !imgArriba || !imgDebajo || slides.length === 0) return;

    let indiceActual = 0;
    let intervaloId = null;
    let enTransicion = false;

    const duracionSalidaMs = 850;
    const intervaloSlideMs = 4200;

    function crearIndicadores() {
        if (!indicadoresContenedor) return;
        indicadoresContenedor.innerHTML = '';

        slides.forEach((_, idx) => {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'carrusel-dot';
            boton.setAttribute('aria-label', `Ir a la imagen ${idx + 1}`);
            boton.addEventListener('click', () => {
                if (idx === indiceActual || enTransicion) return;
                irASlide(idx);
                reiniciarIntervalo();
            });
            indicadoresContenedor.appendChild(boton);
        });
    }

    function actualizarIndicadores() {
        if (!indicadoresContenedor) return;
        const dots = indicadoresContenedor.querySelectorAll('.carrusel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('activo', idx === indiceActual);
        });
    }

    function transicionarHacia(nuevoIndice) {
        if (enTransicion) return;
        enTransicion = true;

        const siguiente = slides[nuevoIndice];
        indiceActual = nuevoIndice;
        actualizarIndicadores();

        // 1. Prepara la imagen entrante debajo
        imgDebajo.src = siguiente.src;
        imgDebajo.alt = siguiente.alt;

        // 2. Anima la salida suave de la imagen superior
        requestAnimationFrame(() => {
            imgArriba.classList.add('saliendo');
        });

        // 3. Al terminar la salida, pasa la nueva imagen a la capa superior sin saltos
        setTimeout(() => {
            imgArriba.classList.add('sin-transicion');
            imgArriba.classList.remove('saliendo');
            imgArriba.src = siguiente.src;
            imgArriba.alt = siguiente.alt;

            // Fuerza reflow para aplicar el cambio sin transición antes de reactivarla
            void imgArriba.offsetWidth;
            imgArriba.classList.remove('sin-transicion');

            enTransicion = false;
        }, duracionSalidaMs);
    }

    function irASlide(nuevoIndice) {
        const indiceNormalizado = (nuevoIndice + slides.length) % slides.length;
        transicionarHacia(indiceNormalizado);
    }

    function siguienteSlide() {
        irASlide(indiceActual + 1);
    }

    function iniciarIntervalo() {
        if (slides.length <= 1 || intervaloId) return;
        intervaloId = setInterval(siguienteSlide, intervaloSlideMs);
    }

    function detenerIntervalo() {
        if (!intervaloId) return;
        clearInterval(intervaloId);
        intervaloId = null;
    }

    function reiniciarIntervalo() {
        detenerIntervalo();
        iniciarIntervalo();
    }
    carruselContenedor.addEventListener('mouseenter', detenerIntervalo);
    carruselContenedor.addEventListener('mouseleave', iniciarIntervalo);
    carruselContenedor.addEventListener('focusin', detenerIntervalo);
    carruselContenedor.addEventListener('focusout', iniciarIntervalo);
    // Estado inicial
    imgArriba.src = slides[0].src;
    imgArriba.alt = slides[0].alt;
    imgDebajo.src = slides[0].src;
    crearIndicadores();
    actualizarIndicadores();
    iniciarIntervalo();
});