# Axel Digital — sitio profesional desde cero

El paquete contiene una versión estática para GitHub Pages y una versión lista para probar en XAMPP con PHP/MySQL. El diseño usa imágenes SVG locales, animaciones CSS suaves, menú móvil, filtro de proyectos y formulario validado.

## Estructura
- `github-pages/`: solo HTML/CSS/JavaScript e imágenes locales. Publica esta carpeta en GitHub Pages.
- `xampp-app/`: copia para `htdocs`, con PHP, esquema SQL, almacenamiento de solicitudes, inicio de sesión de administración, Python opcional y SQL Server opcional.

## Personaliza primero
Edita `assets/site-config.js` en la versión que vayas a usar. Configura `whatsappNumber` y `email` con tus datos reales. No inventes datos de contacto ni publiques datos que no quieras hacer públicos. Las tarjetas de portafolio son conceptos demostrativos; cámbialas por trabajos propios o mantenlas claramente etiquetadas.

## Publicar estática en GitHub Pages
1. Descomprime el ZIP.
2. Sube únicamente el contenido de `github-pages/` a la raíz del repositorio asignado a Pages.
3. En GitHub, abre Settings → Pages y selecciona la rama y carpeta publicadas.
4. GitHub Pages no ejecuta PHP, Python ni bases de datos. El formulario de esta versión necesita que configures WhatsApp o correo en `assets/site-config.js` para tener una salida de contacto.

## Instalar backend en XAMPP (Windows)
1. Copia `xampp-app` a `C:\xampp\htdocs\axel-digital`.
2. En el panel de XAMPP inicia Apache y MySQL.
3. Abre `http://localhost/phpmyadmin`, entra en Importar y selecciona `C:\xampp\htdocs\axel-digital\database\schema.sql`.
4. Abre `C:\xampp\htdocs\axel-digital\config\database.php` y ajusta host, base de datos, usuario y contraseña si tu MySQL no usa la configuración estándar de XAMPP.
5. En CMD ejecuta:
   ```bat
   cd /d C:\xampp\htdocs\axel-digital
   C:\xampp\php\php.exe create_admin.php admin@tudominio.com
   ```
   El script pedirá dos veces la contraseña. Usa una contraseña larga y única.
6. Abre `http://localhost/axel-digital/` y el acceso de administrador en `http://localhost/axel-digital/admin/`.
7. Envía una solicitud de prueba y revisa la tabla `contact_messages` desde phpMyAdmin.

## Funciones incluidas
- Formulario de contacto validado por navegador y por PHP, guardado en MySQL mediante consulta preparada.
- Protección básica contra spam mediante campo trampa y límite por sesión.
- Login administrativo con hash de contraseña, sesión y token CSRF; listado y actualización de estado de solicitudes.
- Servicio Python opcional de estimaciones demostrativas en `python-service/app.py`.
- Esquema SQL Server separado para analítica, sin conexión automática con MySQL.

## Python opcional
```bat
cd /d C:\xampp\htdocs\axel-digital\python-service
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
py app.py
```
Queda escuchando solo en `127.0.0.1:5055`. Los rangos del estimador son de demostración y deben ajustarse a tu política real de precios. No se conecta automáticamente al flujo PHP.

## SQL Server opcional
Ejecuta `database/sqlserver_analytics.sql` en una instancia de SQL Server si deseas crear las tablas analíticas. Es un esquema separado; para sincronizar datos desde MySQL hace falta desarrollar una integración ETL/configurar credenciales seguras.

## Seguridad antes de producción
Este proyecto es una base funcional para desarrollo, no una auditoría de seguridad ni garantía de ausencia de fallos. Usa HTTPS, contraseñas robustas, un usuario SQL con permisos mínimos, backups, límites anti-spam y actualizaciones. No publiques el backend PHP en GitHub Pages y nunca subas credenciales reales al repositorio. Haz pruebas en un entorno de staging antes de recibir datos de clientes.
