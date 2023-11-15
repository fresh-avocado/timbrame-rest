# Tímbrame REST

Microservicio encargado de manejar los usuarios de Tímbrame, las solicitudes de amistad, etc.

# Setup

## `.env`

Correr el _setup_ (solo necesario una sola vez):

```bash
npx dotenv-vault@latest new vlt_0338d32fafca6eb1c97addf08c0951f00f9fcd538e6bb7531527be3f672a366e
```

Obtener la última copia del `.env`:

```bash
npx dotenv-vault@latest pull
```

Si se realizan cambios el `.env`, pushear los cambios así:

```bash
npx dotenv-vault@latest push
```

Finalmente, correr con:

```bash
yarn dev
```

## Docker

### Para desarrollo:

Buildear la imagen:

```bash
docker build -t timbrame-rest:1.0 -f ./Dockerfile.dev .
```

Correr el contenedor:

```bash
docker run -p 8081:8081 timbrame-rest:1.0
```

Entrar al contenedor desde VS Code, cambiar el código y commitear al repo desde ahí.
