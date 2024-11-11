import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Body,
} from '@nestjs/common';
import { ConversationMembersService } from 'src/conversation-members/conversation-members.service';

@Injectable()
export class MemberConversationGuard implements CanActivate {
  constructor(private conversationMembersService: ConversationMembersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const body = request.body;

    const checkMember =
      await this.conversationMembersService.checkUserInConversation(
        user.user_id,
        body.conversation_id,
      );

    return checkMember ? true : false;
  }
}
