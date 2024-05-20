# Nest JS

- xử lý vòng Dependency injection dựa trên angular
- @Injectable(): là lớp có thể được quản lý bởi Nest IoC

# Nest JS Pipes

- validate data, transformation, throw exception

```
npm install class-validator class-transformer
@IsOptional(): không có cũng được, nếu có phải đúng type data
```

# Install PG TYPEORM @NESJS/TYPEORM

```
npm i @nestjs/typeorm typeorm pg
```

# JWT

```
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
```

- Validate

```
npm i @types/passport-jwt
```

# Config

- Fix env on window

```
npm install -g cross-env
"start:dev": "cross-env STAGE=dev nest start --watch",
```
