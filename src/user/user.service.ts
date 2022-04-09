import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
    return user;
  }

  async getAllUsers() {
    return this.userRepository.findAll({include: {all: true}})
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value)
    
    if (role && user) {
      user.$add('roles', role.id)
      return dto
    }
    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
  }
}
