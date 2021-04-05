import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        httpsOptions: {},
    });

    app.enableCors({
        allowedHeaders: 'Content-Type',
        methods: 'POST,GET,PUT,PATCH,DELETE,OPTIONS',
        credentials: true,
        origin: true,
    });

    app.use(helmet());
    // prefix : /api/v1
    // app.setGlobalPrefix('api/v1');

    // swagger document creation
    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle('Toy-Stocks API')
            .setVersion('1.0')
            .setDescription('Toy-Stocks API v1.0')
            .build(),
    );

    // swagger setup
    SwaggerModule.setup('/swagger', app, document, {
        customSiteTitle: 'Toy-Stocks',
        // customfavIcon:
    });

    await app.listen(3000);
}
bootstrap();
