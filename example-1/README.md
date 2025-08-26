# Objetivo

* Simular el comportamiento de la página de [NIC Argentina](https://nic.ar/). 

Para lograr el objetivo, utilizaremos el servicio de [RDAP](https://rdap.nic.ar/) que nos brinda [NIC Argentina](https://nic.ar/).

[Ver más documentación de RDAP](https://datatracker.ietf.org/doc/html/rfc7480)

# ¿Qué hace el código?

Levanta el directorio **"/public"** como estático con [Node Js](https://nodejs.org/) y crea el endpoint **"/api/rdap/domain/:domain"** para simular el comportamiento de [RDAP](https://nic.ar/).
El motivo de crear este endopoint se debe a que si deseamos consultar la información de los dominios utilizando el servicio de [RDAP](https://nic.ar/) <u>desde el frontend</u>, el servidor <u>no</u> aceptará la solicitud y obtendremos un error de CORS (Cross-origin resource sharing).

# ¿Cómo iniciamos la aplicación?

## Utilizando Docker

1. Instalar [Docker](https://www.docker.com/)

[Ver guía de instalación](https://docs.docker.com/get-started/get-docker/)

2. Crear la imagen

``` sh
docker build -t rdap .
```

3. Correr la imagen

``` sh
docker run --rm -p 3000:3000 -d rdap
```

## Utilizando Node Js

1. Instalar [Node Js](https://nodejs.org/)

[Ver guía de instalación](https://nodejs.org/es/download)

2. Correr el servidor web

``` sh
npm start
```