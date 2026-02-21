import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('db')
  async db() {
    const result = await this.prisma.$queryRaw<
      {
        ok: number;
      }[]
    >`SELECT 1 as ok`;
    return { ok: result[0].ok };
  }
}
