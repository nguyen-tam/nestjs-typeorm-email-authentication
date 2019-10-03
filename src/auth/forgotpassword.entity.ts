import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ForgotPassword {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(type => User)
    @JoinColumn()
    user: User;    

    @Column('int')
    token: number;

    @Column()
    timestamp: Date;

}