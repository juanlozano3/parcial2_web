# Documentación API REST - Parcial 2

## Estudiantes

### Crear estudiante

**POST** `/estudiantes`

#### Body

```json
{
  "cedula": 123456,
  "nombre": "JuanLozano",
  "correo": "juan@gmail.com",
  "programa": "Ingeniería",
  "semestre": 8
}
```

#### Respuesta `201 Created`

```json
{
  "id": 1,
  "cedula": 123456,
  "nombre": "Juan Lozano",
  "correo": "juan@gmail.com",
  "programa": "Ingeniería",
  "semestre": 8
}
```

---

### Buscar estudiante por ID

**GET** `/estudiantes/:id`

#### Respuesta `200 OK`

```json
{
  "id": 1,
  "nombre": "Juan Lozano",
  "correo": "juan@gmail.com",
  "semestre": 8
}
```

### Inscribirse en actividad

**POST** `/estudiantes/:id/inscribir/:actividadId`

#### Respuesta `200 OK`

```text
"Inscripción realizada exitosamente"
```

#### Error `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "Ya estás inscrito en esta actividad"
}
```

---

## Actividades

### Crear actividad

**POST** `/actividades`

#### Body

```json
{
  "titulo": "Partido Santa Fe",
  "fecha": "2024-05-17",
  "cupoMax": 30,
  "estado": 0
}
```

#### Respuesta `201 Created`

```json
{
  "id": 1,
  "titulo": "Partido Santa Fe",
  "fecha": "2024-05-17",
  "cupoMax": 30,
  "estado": 0
}
```

---

### Cambiar estado

**PATCH** `/actividades/:id/estado`

Body

```json
{
  "estado": 1
}
```

#### Respuesta `200 OK`

```text
"Estado cambiado exitosamente a 1"
```

---

### Buscar actividades por fecha

**POST** `/actividades/buscar?fecha=2024-05-17`

#### Respuesta `200 OK`

```json
[
  {
    "id": 1,
    "titulo": "Partido Santa Fe",
    "fecha": "2024-05-17"
  }
]
```

---

## Reseñas

### Agregar reseña

**POST** `/resenias/:estudianteId/:actividadId`

#### Body

```json
{
  "comentario": "Excelent",
  "calificacion": 5,
  "fecha": "2024-05-17"
}
```

#### Respuesta `201 Created`

```text
"Reseña agregada exitosamente"
```

#### Error `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "La actividad aún no ha finalizado"
}
```

---

## Códigos de estado usados

- `200 OK`: operación exitosa
- `201 Created`: recurso creado correctamente
- `400 Bad Request`: error de validación o lógica
- `404 Not Found`: recurso no encontrado

---
