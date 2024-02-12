import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Game from "./logics/Game";
import { BluePiece } from "./logics/VariantPiece";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("ws");
  await app.listen(3000);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}
bootstrap().then(() => {
  /* Empty */
});
