import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: { page: number; pageSize: number; keyword?: string }) {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 10));
    const keyword = params.keyword?.trim();

    const where: Prisma.UserWhereInput = keyword
      ? {
          OR: [
            {
              username: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              nickname: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const [list, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          nickname: true,
          role: true,
          createdAt: true,
        },
        orderBy: { id: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async findById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
      },
    });
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.prismaService.user.create({
      data: {
        username: dto.username,
        password: hashSync(dto.password, 10),
        nickname: dto.nickname,
        role: dto.role ?? UserRole.OPERATOR,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, username: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.prismaService.user.findUnique({
        where: { username: dto.username },
        select: { id: true },
      });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        username: dto.username,
        nickname: dto.nickname,
        role: dto.role,
        ...(dto.password ? { password: hashSync(dto.password, 10) } : {}),
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async remove(id: number, currentUserId?: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (currentUserId && id === currentUserId) {
      throw new ConflictException('Cannot delete current logged-in user');
    }

    await this.prismaService.user.delete({ where: { id } });
    return { success: true };
  }
}
