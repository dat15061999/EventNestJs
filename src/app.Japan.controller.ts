import { Controller, Get } from "@nestjs/common";
import { AppJapanService } from "./app.Japan.service";

@Controller()
export class AppJapanController {
  constructor(private readonly appJapan: AppJapanService) { }

  @Get()
  getHello(): string {
    return this.appJapan.getHello();
  }
}