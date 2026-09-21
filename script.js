// ======================================
// MENÚ RESPONSIVE
// ======================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// Cerrar menú al seleccionar una opción

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });

});


// ======================================
// AÑO AUTOMÁTICO DEL FOOTER
// ======================================

document.getElementById("year").textContent = new Date().getFullYear();


// ======================================
// FORMULARIO DE CONTACTO
// ======================================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const servicio = document.getElementById("servicio").value;
    const mensaje = document.getElementById("mensaje").value;

    // Cambia este correo por tu correo real
    const correoDestino = "TU-CORREO@ejemplo.com";

    const asunto = encodeURIComponent(
        `Solicitud de servicio - ${servicio}`
    );

    const cuerpo = encodeURIComponent(
        `Hola Axel,

Mi nombre es: ${nombre}

Mi correo: ${email}

Servicio que necesito: ${servicio}

Mensaje:
${mensaje}

Gracias.`
    );

    const mailto = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpo}`;

    window.location.href = mailto;

});