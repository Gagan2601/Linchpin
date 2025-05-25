import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export const ThrottlerConfigModule = ThrottlerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      name: 'global',
      ttl: config.get<number>('THROTTLE_TTL', 60000), // 1 minute (ms)
      limit: config.get<number>('THROTTLE_LIMIT', 100), // 100 req/IP/min
    },
  ],
});
