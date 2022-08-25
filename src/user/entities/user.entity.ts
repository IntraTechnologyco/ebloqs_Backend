import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ array: false, type: 'varchar' })
    deviceID: string[];

    @Column({ type: 'varchar' })
    typeacount: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'bool', nullable: true })
    emailverificated: boolean;

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
