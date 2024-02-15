import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SocketModule } from "../socket/socket.module";

describe("AppModule", () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ServeStaticModule.forRoot({
          rootPath: "",
          exclude: ["/ws/**/*"],
        }),
        SocketModule,
      ],
      controllers: [],
      providers: [],
    }).compile();
    appModule = app.get<AppModule>(AppModule);
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });
});
