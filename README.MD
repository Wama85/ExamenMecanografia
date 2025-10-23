# 📝 TEST DE MECANOGRAFÍA CON GOOGLE SHEETS

Sistema completo para evaluar la velocidad y precisión de mecanografía con guardado automático en Google Sheets.

## 🚀 CARACTERÍSTICAS

✅ Temporizador de 2 minutos
✅ Bloqueo automático al finalizar el tiempo
✅ Cálculo de palabras correctas y WPM (palabras por minuto)
✅ Puntuación sobre 10
✅ Prevención de copiar/pegar
✅ Guardado automático en Google Sheets
✅ Interfaz responsive con Bootstrap

## 📋 REQUISITOS

- Cuenta de Google
- Navegador web moderno
- Servidor web local (para desarrollo) o servidor de producción

## 🔧 INSTALACIÓN

### PASO 1: Configurar Google Sheets

1. Abre Google Sheets: https://sheets.google.com
2. Crea una nueva hoja de cálculo
3. Copia el ID de tu hoja (está en la URL):
   ```
   https://docs.google.com/spreadsheets/d/TU_ID_AQUI/edit
   ```

### PASO 2: Configurar Google Apps Script

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Borra el código que aparece por defecto
3. Copia y pega el contenido de `google-apps-script.js`
4. En la línea 29, **REEMPLAZA** el ID con el ID de tu hoja:
   ```javascript
   const spreadsheet = SpreadsheetApp.openById('TU_ID_AQUI');
   ```
5. Guarda el proyecto (Ctrl + S)
6. Haz clic en **Implementar** > **Nueva implementación**
7. En "Tipo", selecciona **Aplicación web**
8. Configura:
   - **Ejecutar como:** Tu cuenta
   - **Quién tiene acceso:** Cualquier persona
9. Haz clic en **Implementar**
10. **Autoriza** la aplicación cuando te lo pida
11. **COPIA LA URL** que te da (es muy importante)

### PASO 3: Configurar el HTML

1. Abre el archivo `test-mecanografia.html`
2. En la línea 44, **REEMPLAZA** la URL con la que copiaste:
   ```javascript
   const GOOGLE_SHEETS_URL = 'TU_URL_DE_GOOGLE_SHEETS_AQUI';
   ```
3. Guarda el archivo

### PASO 4: Configurar el texto del test

1. Edita el archivo `texto.txt` con el texto que desees usar
2. Asegúrate de que esté en el mismo directorio que el HTML

### PASO 5: Ejecutar el test

1. Abre `test-mecanografia.html` en tu navegador
2. Si estás en desarrollo local, usa un servidor:
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server`
   - VS Code: extensión Live Server

## 📊 ESTRUCTURA DE DATOS EN GOOGLE SHEETS

La hoja "Resultados" contendrá:

| Fecha | Nombre | Apellido | Palabras Correctas | Puntuación |
|-------|--------|----------|-------------------|------------|
| 2025-10-22 14:30:00 | Juan | Pérez | 85 | 8.50 |

## 🎯 CÓMO FUNCIONA

1. El usuario ingresa su **nombre y apellido** (obligatorio)
2. El campo de texto se **desbloquea** automáticamente
3. Al comenzar a escribir, el **temporizador inicia** (2 minutos)
4. El sistema calcula en tiempo real:
   - Palabras correctas
   - WPM (palabras por minuto)
   - Puntuación sobre 10
5. Cuando termina el tiempo:
   - Se **bloquean todos los campos**
   - Se muestra la **nota final**
   - Los datos se **envían automáticamente** a Google Sheets

## 🔒 SEGURIDAD

- No se permite pegar texto (Ctrl+V bloqueado)
- Los campos se bloquean después de nombre/apellido
- El textarea se bloquea al terminar el test
- Validación de datos en Google Apps Script

## 🎨 SISTEMA DE CALIFICACIÓN

- **9-10:** ¡Excelente! (Verde)
- **7-8.9:** ¡Muy bien! (Azul)
- **5-6.9:** Bien (Amarillo)
- **0-4.9:** Necesitas mejorar (Rojo)

## 🐛 SOLUCIÓN DE PROBLEMAS

### El test no guarda en Google Sheets

1. Verifica que la URL en el HTML esté correcta
2. Asegúrate de haber autorizado la aplicación
3. Revisa que "Quién tiene acceso" sea "Cualquier persona"
4. Mira la consola del navegador (F12) para ver errores

### No se carga el texto

1. Verifica que `texto.txt` esté en el mismo directorio
2. Si usas servidor local, asegúrate de que esté corriendo
3. Revisa la consola del navegador para errores

### El temporizador no funciona

- Asegúrate de haber ingresado nombre y apellido
- Verifica que no haya errores de JavaScript en la consola

## 📝 PERSONALIZACIÓN

### Cambiar el tiempo del test

En `test-mecanografia.html`, línea 47:
```javascript
let tiempoLimite = 120; // Cambiar a los segundos deseados
```

### Modificar el texto del test

Edita el archivo `texto.txt` con cualquier texto que desees.

### Cambiar colores o estilos

Modifica la sección `<style>` en el HTML o las clases de Bootstrap.

## 📄 ARCHIVOS INCLUIDOS

- `test-mecanografia.html` - Interfaz principal del test
- `google-apps-script.js` - Código para Google Apps Script
- `texto.txt` - Texto de ejemplo para el test
- `README.md` - Este archivo

## 💡 CONSEJOS

- Prueba primero con tu propia cuenta antes de compartir
- Puedes cambiar el texto del test según tus necesidades
- El sistema funciona offline (excepto el guardado en Sheets)
- Puedes agregar más validaciones según tus necesidades

## 🆘 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los registros en Google Apps Script
3. Asegúrate de seguir todos los pasos de instalación

## 📜 LICENCIA

Proyecto libre para uso educativo y personal.

---

**¡Listo para usar!** 🎉