import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, BeforeUpdate} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 255 })
    @IsEmail()
    @ApiModelProperty()
    email: string;

    @BeforeInsert()        
    hashPassword() {        
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);          
    }        
    @Column()
    @IsNotEmpty()
    @ApiModelProperty()
    password: string;

    @Column({
        default: new Date().toISOString().slice(0, 19).replace('T', ' ')
    })
    updated_time: Date;   

    @Column({default: false})
    is_verified: boolean;        
}