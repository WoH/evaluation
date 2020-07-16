import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  } else {
    app.enableCors({ origin: process.env.SERVER_ORIGIN });
  }

  const port = parseInt(process.env.PORT!);
  const options = new DocumentBuilder()
    .setTitle("Todo Application")
    .setDescription("A simple Todo Application")
    .setVersion("0.0.1")
    .addBearerAuth({ type: "http", bearerFormat: "JWT" })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  await app.listen(port);
}
bootstrap();
