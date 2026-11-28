# Rumbo Viajes

Rumbo es una aplicación para explorar destinos y consultar vuelos y hoteles. Cada destino muestra su país, una descripción y actividades populares. Al elegirlo, puedes comparar las opciones de transporte y alojamiento con sus precios, fechas y disponibilidad.

[Abrir Rumbo Viajes](https://exequielvenegas.github.io/viajes-exequiel-venegas-PFY2202/)

## Cómo funciona

La pantalla principal obtiene los destinos desde una API REST. La pantalla de cada destino consulta los vuelos y hoteles mediante GraphQL con Apollo Client. Ambos servicios son simulados con MSW y funcionan en el navegador, sin un servidor externo ni una base de datos.

El esquema GraphQL define los datos disponibles y valida las consultas. Las opciones se solicitan usando el identificador del destino; la respuesta incluye únicamente los campos pedidos.

Mientras se consultan datos aparece un indicador de carga. Si una petición falla, puedes reintentar o volver al listado de destinos. Los productos agotados se identifican y, cuando no hay vuelos u hoteles, se muestra un mensaje con una alternativa para continuar.

Apollo conserva las consultas en memoria y REST reutiliza los resultados recientes. Al recargar la página se reinician esos datos.

El catálogo es de demostración: los destinos son reales, pero los proveedores, precios, fechas y disponibilidad son ficticios. Todos los importes están expresados en pesos chilenos. Los vuelos muestran el precio de ida y vuelta por persona; los hoteles, el precio por habitación y noche y el total de cinco noches. No se realizan reservas ni pagos.

## Ejecutar

Necesitas Node.js 22.12 o superior. Desde la carpeta del proyecto:

```bash
npm ci
npm run dev
```

Abre la dirección que aparece en la terminal. Para que la API simulada funcione, utiliza localhost durante el desarrollo o HTTPS al publicar.

## Pruebas y compilación

```bash
npm test
npm run test:coverage
npm run build
npm run preview
```

Las pruebas usan Jest y React Testing Library. Comprueban las tarjetas, la navegación, los estados de carga, los resultados vacíos, los errores y el reintento desde la interfaz. MSW simula todas las peticiones REST y GraphQL, sin usar servicios externos. También se prueban el esquema GraphQL, las opciones por destino y la caché de Apollo.

`npm run test:coverage` genera el reporte completo en `coverage/index.html` y un resumen en la terminal. La medición incluye todos los archivos JavaScript y JSX de `src`, incluso los que no se ejecutan en las pruebas. El comando falla si la cobertura global de sentencias, funciones o líneas queda por debajo del 50%.

Para ejecutar las pruebas al guardar cambios, utiliza `npm run test:watch`. Jest se ejecuta con soporte para los módulos ESM del proyecto; Node puede mostrar una advertencia sobre VM Modules.

La compilación genera los archivos de publicación en `dist/`.

## Estructura

- `src/pages/`: pantallas de destinos y opciones de viaje.
- `src/components/`: tarjetas y estados de carga y error.
- `src/api/queries.js`: consulta GraphQL de vuelos y hoteles.
- `src/api/apollo.js`: configuración de Apollo Client.
- `src/api/DestinationsContext.jsx`: estado compartido de destinos obtenidos por REST.
- `src/mocks/schema.js`: tipos GraphQL y resolución de consultas.
- `src/mocks/handlers.js`: respuestas de los servicios REST y GraphQL.
- `src/mocks/data.js`: catálogo de demostración.
- `tests/app.test.jsx`: flujos de navegación y consultas desde la interfaz.
- `tests/components.test.jsx`: estados de las peticiones y tarjetas de viaje.
- `tests/integration.test.js`: integración REST, GraphQL y caché.
- `tests/support/`: entorno de navegador simulado, servidor MSW y utilidades de renderizado.

La navegación utiliza React Router con rutas que llevan `#`, compatibles con GitHub Pages.

## Tecnologías

React, React Router, JavaScript, CSS, Vite, Apollo Client, GraphQL, MSW, Jest y React Testing Library.
