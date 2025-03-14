import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async findByUdid(udid: string): Promise<Device> {
    return this.deviceRepository.findOne({ where: { udid } });
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async update(id: number, deviceData: Partial<Device>): Promise<Device> {
    await this.deviceRepository.update(id, deviceData);
    return this.deviceRepository.findOne({ where: { id } });
  }

  async updateByUdid(udid: string, deviceData: Partial<Device>): Promise<Device> {
    const device = await this.findByUdid(udid);
    if (device) {
      await this.deviceRepository.update(device.id, deviceData);
      return this.deviceRepository.findOne({ where: { id: device.id } });
    }
    return null;
  }
}