import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
// Providers
import { MongooseModule } from '@nestjs/mongoose';
// Config
import config from '@app/app.config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, host, name, password, user } =
          configService.database;
        return {
          uri: `${connection}://${user}:${password}@${host}/${name}?retryWrites=true&w=majority`,
          user,
          pass: password,
          dbName: name,
        };
      },
      inject: [config.KEY],
    }),
  ],
})
export class DatabaseModule {}
