import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('NestJS API Docs')
        .setDescription("NestJS API description")
        .setVersion('1.0.0')
        .addBearerAuth({
            description: 'JWT access-token 입력',
            name: 'JWT',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'Token'
        }, 'access-token')
        .build()

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
}