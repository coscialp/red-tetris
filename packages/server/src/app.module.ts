import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "client", "dist"),
      exclude: ["/ws/**/*"],
    }),
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
