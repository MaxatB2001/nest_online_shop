import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь уже зарегестрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });
    return this.generateJwtToken(user);
  }

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return this.generateJwtToken(user);
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (user && passwordMatch) {
      return user
    }
    throw new UnauthorizedException({message: 'Данные не прошли валидацию'})
  }

  private async generateJwtToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload)
    }
  }
}
