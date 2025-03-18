import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { CreateUserRequestDto, UpdateUserRequestDto } from './dto';
import { UsersService } from './users.service';
import { API_V1 } from '../../app.constants';
import { Auth } from '../../decorators';
import { IUser } from '../auth/auth.types';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: API_V1 })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ description: 'New user payload', type: CreateUserRequestDto })
  @ApiCreatedResponse({ description: 'Created response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async create(@Auth() auth: IUser, @Body() payload: CreateUserRequestDto): Promise<any> {
    // return this.usersService.create(auth, payload);
    console.log('create', { auth, payload });
  }

  @Get('/')
  @ApiOperation({ summary: 'Get users list' })
  @ApiOkResponse({ description: 'OK response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async list(@Auth() auth: IUser): Promise<any> {
    console.log('list', { auth });

    return this.usersService.list();
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete existing user' })
  @ApiOkResponse({ description: 'OK response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async remove(@Auth() auth: IUser, @Param('id') id: string): Promise<any> {
    // return this.usersService.remove(id);
    console.log('remove', { auth, id });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a specific user details' })
  @ApiOkResponse({ description: 'OK response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async show(@Auth() auth: IUser, @Param('id') id: string): Promise<any> {
    // return this.usersService.show(id);
    console.log('show', { auth, id });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update existing user' })
  @ApiBody({ description: 'Update user payload', type: UpdateUserRequestDto })
  @ApiOkResponse({ description: 'OK response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  public async update(
    @Auth() auth: IUser,
    @Param('id') id: string,
    @Body() payload: UpdateUserRequestDto,
  ): Promise<any> {
    // return this.usersService.update(auth, id, payload);
    console.log('update', { auth, id, payload });
  }
}
