# MineraSalud 🦺⛏️

**MineraSalud** es una aplicación web enfocada en el **monitoreo diario de síntomas y hábitos de salud** de trabajadores del rubro minero, con el objetivo de apoyar la **prevención de riesgos**, el **autocuidado** y la **gestión de la salud ocupacional** mediante tecnología.

El sistema permite registrar información diaria y visualizarla de forma clara a través de un **calendario interactivo**, facilitando el seguimiento y la toma de decisiones tanto a nivel personal como organizacional.

---

## 🎯 Objetivo del Proyecto

Desarrollar una solución digital que:

- Permita registrar síntomas y condiciones de salud diariamente.
- Visualice los registros de manera intuitiva mediante un calendario.
- Apoye la prevención de riesgos laborales en el contexto minero.
- Fomente el autocuidado y la detección temprana de patrones de salud.

Este proyecto fue desarrollado como parte de un **proyecto académico**, aplicando buenas prácticas de desarrollo de software y enfoque en experiencia de usuario.

---

## 🧠 Funcionalidades Principales

- ✅ Registro diario de síntomas (ej. cefalea, mareos, náuseas, palpitaciones, etc.)
- 📅 Calendario interactivo con días destacados según registros existentes
- 🔍 Visualización detallada de síntomas por día
- 🎨 Indicadores visuales (colores) para identificar días con información
- 📋 Modal de detalle diario con información organizada y legible
- 🔐 Gestión de datos asociada a usuario autenticado

---

## 🛠️ Tecnologías Utilizadas

- **Angular**
- **Ionic Framework**
- **TypeScript**
- **RxJS**
- **Firebase / Firestore**
- **HTML5 / SCSS**
- **Git & GitHub**

---

## 🧩 Arquitectura General

- **Componentes standalone** para mejor modularidad
- **Servicios centralizados** para manejo de datos y estado (CalendarService, SymptomService)
- **Observables (BehaviorSubject)** para actualización reactiva del calendario
- **Modales dinámicos** para visualización de detalles diarios
- **Separación clara entre lógica de negocio y presentación**

---

## 🐞 Problemas Técnicos Abordados

Durante el desarrollo se identificó y resolvió un problema donde los datos recién guardados no se reflejaban inmediatamente en la interfaz.

✔️ Solución:

- Manejo correcto del estado global mediante `BehaviorSubject`
- Sincronización entre servicios y componentes
- Eliminación de la necesidad de interacciones duplicadas (doble clic)

Esto permitió mejorar la **consistencia de datos** y la **experiencia de usuario**.

---

## 🚀 Instalación y Ejecución

### Requisitos

- Node.js
- Ionic CLI
- Angular CLI

### Pasos

```bash
npm install
ionic serve
```
