import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Application } from '../applications/application.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  udid: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  productName: string;

  @Column({ nullable: true })
  osVersion: string;

  @Column({ default: false })
  isManaged: boolean;

  @Column({ nullable: true })
  imei: string;

  @Column({ nullable: true })
  meid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  lastSeenAt: Date;

  @OneToMany(() => Application, application => application.device)
  applications: Application[];
}