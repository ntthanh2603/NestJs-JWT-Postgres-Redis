import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/users/users.interface';
import { PostsService } from 'src/posts/posts.service';
import { RelationshipType, RoleType, ScopeType } from 'src/helper/helper.enum';
import { RelationshipsService } from 'src/relationships/relationships.service';
import { GroupUsersService } from 'src/groupusers/groupusers.service';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { FunctionHelper } from 'src/helper/helper.function';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private postsService: PostsService,
    private relationshipsService: RelationshipsService,
    private groupusersService: GroupUsersService,
    private functionHelper: FunctionHelper,
  ) {}

  async findCommentById(comment_id) {
    if (!this.functionHelper.isValidUUID(comment_id)) {
      throw new BadRequestException('Invalid group ID format');
    }
    const comment = await this.commentsRepository.findOne({
      where: {
        comment_id,
      },
    });
    if (comment) return comment;
    throw new NotFoundException();
  }
  async create(user: IUser, createDto: CreateCommentDto) {
    const post = await this.postsService.findPostById(createDto.post_id);

    if (post.scope == ScopeType.PUBLIC) {
      return await this.commentsRepository.save({
        user_id: user.user_id,
        post_id: createDto.post_id,
        content: createDto.content,
      });
    }

    if (post.scope == ScopeType.PROTECTED && post.role == RoleType.USER) {
      const relationship = await this.relationshipsService.findRelationship(
        user.user_id,
        post.target_id,
      );
      if (relationship.relationship == RelationshipType.FRIEND) {
        return await this.commentsRepository.save({
          user_id: user.user_id,
          post_id: createDto.post_id,
          content: createDto.content,
        });
      }
      throw new ForbiddenException();
    }

    if (post.scope == ScopeType.PROTECTED && post.role == RoleType.GROUP) {
      const groupuser = await this.groupusersService.findUserInGroup(
        user.user_id,
        post.target_id,
      );
      if (groupuser.role == RoleType.ADMIN || groupuser.role == RoleType.USER) {
        return await this.commentsRepository.save({
          user_id: user.user_id,
          post_id: createDto.post_id,
          content: createDto.content,
        });
      }
      throw new ForbiddenException();
    }
    throw new BadRequestException();
  }

  async update(user: IUser, updateDto: UpdateCommentDto) {
    const comment = await this.findCommentById(updateDto.comment_id);

    if (user.user_id == comment.user_id) {
      return this.commentsRepository.update(
        {
          comment_id: updateDto.comment_id,
        },
        {
          content: updateDto.content,
        },
      );
    }
  }

  async remote(user: IUser, deleteDto: DeleteCommentDto) {
    const comment = await this.findCommentById(deleteDto.comment_id);

    if (user.user_id == comment.user_id) {
      return this.commentsRepository.delete(comment);
    }

    throw new BadRequestException();
  }
}
