# Proyecto 1: Web de Inscripción (GymPro)

Este proyecto es la implementación del frontend para un sistema de reservas de clases de gimnasio. Es una práctica para la asignatura de Desarrollo Web, centrada en HTML, CSS y JavaScript, que simula el flujo de un usuario desde el login hasta la confirmación de una reserva.

## Autor

* Federico Luque Santos

## Tecnologías Utilizadas

* **HTML5**: Para la estructura semántica de las 4 páginas.
* **CSS3**: Para los estilos visuales, utilizando una única hoja de estilos (`style.css`) para mantener la coherencia.
* **JavaScript (ES6+)**: Para la interactividad, validación de formularios, manipulación del DOM y uso de `localStorage` para simular la sesión de usuario.

## Estructura del Proyecto

La estructura de archivos es plana y se mantiene dentro de la carpeta raíz.

proyecto_gimnasio/
                ├── index.html 
                ├── login.html 
                ├── reserva.html 
                ├── resumen.html 
                ├── script.js 
                ├── style.css 
                └── README.md

**Descripción de archivos:**

* **`login.html`**: Página de inicio de sesión para el socio.
* **`index.html`**: Página principal de bienvenida tras el login.
* **`reserva.html`**: Formulario principal para la inscripción a clases.
* **`resumen.html`**: Página final que muestra la confirmación de la reserva.
* **`style.css`**: Hoja de estilos que da formato a todo el sitio.
* **`script.js`**: Archivo de lógica que controla la interactividad de todo el sitio.
* **`README.md`**: Esta documentación.

## Instrucciones de Uso

Para ejecutar este proyecto, no se necesita un servidor, ya que es una simulación de frontend:

1.  Clona o descarga este repositorio en tu ordenador.
2.  Abre la carpeta del proyecto (`proyecto_gimnasio`) en tu explorador de archivos.
3.  Haz doble clic en el archivo **`login.html`** para abrir la aplicación en tu navegador web predeterminado.
4.  El flujo de navegación te guiará por el resto de las páginas.

## Problemas Encontrados y Soluciones

* **Problema:** Gestionar qué código JS ejecutar en cada página, ya que solo hay un archivo `script.js`.
    * **Solución:** añadir un `id` único a la etiqueta `<body>` de cada HTML (ej. `<body id="page-login">`) y usar un `if` en JavaScript (`if (document.body.id === "page-login") { ... }`) para aislar la lógica de cada página.

* **Problema:** Guardar múltiples datos de la reserva (clase, fecha, extras, precio) en `localStorage` para mostrarlos en la página de resumen.
    * **Solución:** Se utilizó `JSON.stringify()` para convertir un objeto de JavaScript con todos los datos de la reserva en un solo string de texto antes de guardarlo en `localStorage`. En la página de resumen, se usó `JSON.parse()` para recuperar el objeto y mostrar los datos.

* **Problema:** Mostrar la lista de "extras" seleccionados en el resumen.
    * **Solución:** Se guardaron los extras seleccionados en un array de JavaScript. Al mostrarlos en el resumen, se utilizó el método `.join(", ")` para convertirlos en un string legible.

## Posibles Mejoras

* **Backend:** La mejora principal es conectar este frontend con un backend real (Node.js, Express) para gestionar usuarios y reservas en una base de datos.
* **Validación:** Mejorar las validaciones del formulario de reserva (no permitir reservar en fechas pasadas o fuera del horario del gimnasio).
* **Diseño Responsive:** Añadir Media Queries en `style.css` para que la aplicación se adapte mejor a pantallas de dispositivos móviles.