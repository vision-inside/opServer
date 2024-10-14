import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_role')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'user_id' })
    userId: number;

    @Column('varchar', { name: 'role_name' })
    roleName: string;

    @ManyToOne(() => User, user => user.roles)
    @JoinColumn({ name: 'user_id' })
    user: User;
}