import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) {}

  async checkUserExists(email: string): Promise<boolean> {
    let user = await this.userRepository.findOne({ where: { email: email } });    
    return user !== undefined;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user_name: username } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
        where: {
            email: email,
        }
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
        where: {
            id: id,
        }
    });
  }
  
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(contact: User): Promise<UpdateResult> {
    return await this.userRepository.update(contact.id, contact);
  }

}
