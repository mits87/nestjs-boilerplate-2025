import { Injectable, Logger } from '@nestjs/common';

import { CreateUserRequestDto, UpdateUserRequestDto } from './dto';
import { IUser } from '../auth/auth.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public async create(auth: IUser, payload: CreateUserRequestDto): Promise<any> {
    this.logger.log('CREATE USER: ', { auth, payload });
    return Promise.resolve();
  }

  public async list(auth: IUser): Promise<any> {
    this.logger.log('LIST USERS: ', { auth });
    return Promise.resolve();
  }

  public async remove(auth: IUser, id: string): Promise<any> {
    this.logger.log('REMOVE USER: ', { auth, id });
    return Promise.resolve();
  }

  public async show(auth: IUser, id: string): Promise<any> {
    this.logger.log('SHOW USER: ', { auth, id });
    return Promise.resolve();
  }

  public async update(auth: IUser, id: string, payload: UpdateUserRequestDto): Promise<any> {
    this.logger.log('UPDATE USER: ', { auth, id, payload });
    return Promise.resolve();
  }
}
