# User Story Map - Finder de Conciertos

## User Journey

```
[ Iniciar sesión / Registro ] ➔ [ Recomendaciones (Home) ] ➔ [ Buscador / Filtros ] ➔ [ Perfil de Artista ] ➔ [ Concierto / Boletera / Reseñas ]
```

---

## User Story Mapping por Sprints

| Actividad | Registro / Cuenta | Recomendaciones (Home) | Buscador / Filtros | Perfil del Artista | Conciertos / Boletera / Reseñas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1: Esqueleto Funcional** | Registro básico con email y password | Feed estático con eventos generales (mocks). | Búsqueda simple por texto exacto de artista. | Vista básica del artista: nombre, biografía y fechas (mock). | Información básica: recinto, fecha y enlace externo (mock). |
| **Sprint 2: Eventos Reales** | Persistencia de sesión de usuario y tokens de autenticación. | Feed de eventos reales consumidos de API externa. | Búsqueda por artista o evento conectada a API de eventos. | Renderizado de datos reales del artista y eventos actuales. | Vista detallada de concierto: recinto, mapa/dirección, precios y link a boletera. |
| **Sprint 3: Integración de Servicio Musical** | Integración de Spotify OAuth ("Conectar cuenta de Spotify"). | Recomendación v1: Conciertos basados en los Top Artists del usuario. | Búsqueda con autocompletado básico y coincidencia parcial. | Enlace a perfil de Spotify del artista e integración de preview de discografía. | Botón para guardar concierto en lista de deseos. |
| **Sprint 4: Filtros y "Similares"** | Gestión de preferencias musicales manuales . | Recomendación v2: Conciertos de artistas similares (género similar / related artists). | Filtros avanzados: por ciudad/ubicación, rango de fechas y géneros musicales. | Pestaña de artistas relacionados con conciertos próximos. | (Historial) Creación de listas de eventos guardados (próximos, pasados). |
| **Sprint 5: Reseñas** | Perfil de usuario editable (avatar, biografía, ciudad, ...). | Sección personalizada: "Conciertos guardados". | Sugerencias de búsqueda basadas en gustos ("Te podría gustar). | Calificación promedio de conciertos pasados del artista otorgada por usuarios. | Sección de reseñas: texto y calificación por estrellas (1 a 5) en conciertos pasados. |
| **Sprint 6: Seguridad, Features no Esenciales** | Seguridad para iniciar sesión, "olvidí mi contraseña", ... | Manejo de errores externos: si fallan APIs externas, no hay conciertos disponibles, cancelaciones. | Optimización: paginación / scroll infinito en resultados. | Mejora visual, responsive design. | Mostrar reseñas priorizando "Fue útil" dada por los usuarios (reseñas "importantes" primero). |

