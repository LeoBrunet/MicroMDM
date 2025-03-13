import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Device } from '../devices/device.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string; // Bundle ID

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  shortVersion: string;

  @Column({ default: false })
  isManaged: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @ManyToOne(() => Device, device => device.applications)
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @Column()
  deviceId: number;
}