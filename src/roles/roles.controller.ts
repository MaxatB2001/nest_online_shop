import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('/:value')
  getRole(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }

  @Post()
  create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }
}
