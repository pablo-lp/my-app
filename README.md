Podcaster
=========

Mini reproductor web para escuchar podcasts

Instalación
-----------
Descargar el ZIP y renombrar el directorio a "podcaster". Dentro del directorio principal ejecutar:

```shell
npm install
```

Ejecutar en modo de desarrollo (development)
--------------------------------------------
En este modo todos los assets se sirven sin minimizar. Dentro del directorio principal ejecutar:

```shell
grunt development
```

Se creará la carpeta "podcaster/dev"

Acceda a la misma mediante el navegador. Ej: http://localhost:8888/podcaster/dev


Ejecutar en modo de producción (production)
-------------------------------------------
En este modo todos los assets se sirven minimizados. Dentro del directorio principal ejecutar:

```shell
grunt production
```

Se creará la carpeta "podcaster/dist"

Acceda a la misma mediante el navegador. Ej: http://localhost:8888/podcaster/dist


Nota Importante
---------------
Es necesario ejecutar la aplicación en un servidor para que las rutas funcionen correctamente. Se incluye un fichero .htaccess para reescribir las rutas por lo que deberá disponer del módulo mod_rewrite.
