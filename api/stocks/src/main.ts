import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use("/", (req, res) => {
        res.send("Ok")
    })
    
    // prefix : /api/v1
    app.setGlobalPrefix('api/v1');

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
    SwaggerModule.setup('api/v1/swagger', app, document, {
        customSiteTitle: 'Toy-Stocks',
        // customfavIcon:
    });

    await app.listen(3000);
}
bootstrap();
