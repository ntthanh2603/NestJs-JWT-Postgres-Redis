import { ForbiddenException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { ConversationMembersService } from 'src/conversation-members/conversation-members.service';
import { Message } from './entities/messgage.entity';
import { CreateMessageDto } from './dto/create-messgage.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private cmService: ConversationMembersService,
  ) {}

  async create(user: IUser, createMessageDto: CreateMessageDto) {
    const user_id = user.user_id;
    const { conversation_id, message } = createMessageDto;
    if (this.cmService.findMember(user_id, conversation_id)) {
      return await this.messagesRepository.save({
        user_id,
        conversation_id,
        message,
        time: new Date(),
      });
    } else throw new ForbiddenException();
  }
}
