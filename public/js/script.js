// Esperamos a que todo el documento HTML esté cargado antes de ejecutar JS
document.addEventListener("DOMContentLoaded", function() {

    // --- LÓGICA PARA LA PÁGINA: login.html ---
    if (document.body.id === "page-login") {

        // 1. Capturar el formulario de login
        const loginForm = document.getElementById("login-form");
        const errorMessage = document.getElementById("error-message");

        loginForm.addEventListener("submit", function(event) {
            // Evitamos que el formulario se envíe de la forma tradicional
            event.preventDefault(); 

            // Limpiamos el mensaje de error previo
            errorMessage.textContent = "";

            // 2. Capturar los valores de los campos
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // 3. Validaciones
            if (email === "" || password === "") { 
                errorMessage.textContent = "Ambos campos son obligatorios.";
                return;
            }
            
            if (!email.includes("@")) { 
                errorMessage.textContent = "Por favor, introduce un correo válido.";
                return;
            }
            
            // 4. Si todo es correcto, guardamos el email del usuario en localStorage 
            localStorage.setItem("userEmail", email);
            
            // 5. Redirigimos a la página principal
            window.location.href = "reserva.html"; 
        });
    }


    // --- LÓGICA PARA LA PÁGINA: reserva.html ---
    if (document.body.id === "page-reserva") {

        // 2. Capturar elementos del formulario
        const reservaForm = document.getElementById("reserva-form");
        const tipoClase = document.getElementById("tipo-clase");
        const asistentes = document.getElementById("asistentes");
        const extrasCheckboxes = document.querySelectorAll(".extra");
        const precioTotalSpan = document.getElementById("precio-total");
        const errorMessage = document.getElementById("error-message");

        // 3. Función para calcular el precio total automáticamente
        function calcularTotal() {
            let total = 0;
            
            // 3.1. Obtener precio base de la clase
            const precioClase = parseFloat(tipoClase.value) || 0;
            
            // 3.2. Obtener número de asistentes
            const numAsistentes = parseInt(asistentes.value) || 1;
            
            // 3.3. Sumar extras
            let precioExtras = 0;
            extrasCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    // Usamos 'dataset.precio' que pusimos en el HTML
                    precioExtras += parseFloat(checkbox.dataset.precio);
                }
            });

            // 3.4. Cálculo final
            total = (precioClase * numAsistentes) + precioExtras;

            // 3.5. Mostrar el total formateado
            precioTotalSpan.textContent = total.toFixed(2);
        }

        // 4. Añadir listeners para que el precio se actualice solo
        tipoClase.addEventListener("change", calcularTotal);
        asistentes.addEventListener("input", calcularTotal);
        extrasCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener("change", calcularTotal);
        });

        // 5. Manejar el envío del formulario de reserva
        reservaForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Evitar recarga

            // 5.1. Validación simple
            if (tipoClase.value === "0" || !tipoClase.value) {
                errorMessage.textContent = "Por favor, selecciona un tipo de clase.";
                return;
            }

            // 5.2. Recoger todos los datos para el resumen
            const fecha = document.getElementById("fecha-clase").value;
            // .selectedOptions[0].text nos da el texto
            const claseTexto = tipoClase.selectedOptions[0].text;
            const numAsistentes = asistentes.value;
            const precioFinal = precioTotalSpan.textContent;

            // 5.3. Recoger los extras seleccionados
            const extrasSeleccionados = [];
            extrasCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    // Obtenemos el texto de la <label> asociada al checkbox
                    const label = document.querySelector(`label[for='${checkbox.id}']`).textContent;
                    extrasSeleccionados.push(label);
                }
            });

            // 5.4. Crear un objeto con toda la información
            const datosReserva = {
                fecha: fecha,
                clase: claseTexto,
                asistentes: numAsistentes,
                extras: extrasSeleccionados, // Esto es un array
                total: precioFinal
            };

            // 5.5. Guardar el objeto en localStorage
            // Usamos JSON.stringify para convertir el objeto en texto 
            localStorage.setItem("datosReserva", JSON.stringify(datosReserva));

            // 5.6. Redirigir a la página de resumen
            window.location.href = "resumen.html"; 
        });
    }


    // --- LÓGICA PARA LA PÁGINA: resumen.html ---
    if (document.body.id === "page-resumen") {

        // 2. Recuperar el objeto de la reserva desde localStorage
        const datosJSON = localStorage.getItem("datosReserva");

        if (datosJSON) {
            // 3. Convertir el texto JSON de nuevo a un objeto 
            const datos = JSON.parse(datosJSON);

            // 4. Mostrar los datos en los <span>
            document.getElementById("resumen-fecha").textContent = datos.fecha || "No especificada";
            document.getElementById("resumen-clase").textContent = datos.clase; 
            document.getElementById("resumen-asistentes").textContent = datos.asistentes; 
            document.getElementById("resumen-total").textContent = datos.total; 

            // 5. Mostrar los extras (usando .join())
            if (datos.extras && datos.extras.length > 0) {
                document.getElementById("resumen-extras").textContent = datos.extras.join(", "); 
            } else {
                document.getElementById("resumen-extras").textContent = "Ninguno";
            }
            
        } else {
            // Si alguien llega aquí sin datos de reserva
            alert("No hay datos de reserva para mostrar. Volviendo al inicio.");
            window.location.href = "index.html";
        }
    }

});