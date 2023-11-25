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


# AWS Pricing
El precio para las instancias de EC2 esta relacionado con el tipo de instancia elegido (c1.medium, c1.large, t2.small, etc).

|         **Operacion**        | **Costo ($)** |
|:----------------------------:|:-------------:|
| Amazon EKS cluster (Create)  |          0.95 |
| EC2 BottleRocket (c1.medium) |       0.179/h |
| EC2 BottleRocket (c3.large)  |       0.163/h |
