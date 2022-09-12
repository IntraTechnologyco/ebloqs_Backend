import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEnt {
    @PrimaryColumn()
    id: string;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    nacionality: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
    })
    birthdayDate: Date;

    @Column({ type: 'varchar', nullable: true })
    dni: string;

    @Column({ type: 'text', nullable: true })
    typeAcount: string;

    @Column({ array: false, type: 'varchar' })
    deviceID: string[];

    @Column({ type: 'bool', nullable: true })
    emailVerificated: boolean;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    idRef: string;

    @Column({ type: 'bool', nullable: true, default: true })
    status: boolean;

    @Column({ type: 'varchar', nullable: true })
    verify: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true,
    })
    create: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true,
    })
    update: Date;
}
