import { Module } from '@nestjs/common';
import { MessagesModule } from './messgages/messgages.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';

import { RelationshipsModule } from './relationships/relationships.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ConversationMembersModule } from './conversation-members/conversation-members.module';
import { GroupMembersModule } from './group-members/group-members.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để module config có thể sử dụng ở mọi nơi mà không cần import lại
      envFilePath: '...env', // Đường dẫn tới file .env
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    RelationshipsModule,
    MessagesModule,
    ConversationsModule,
    ConversationMembersModule,
    GroupMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
