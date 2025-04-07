import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../device.entity';
import { ApplicationService } from '../../applications/services/application.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService
  ) {}

  async getDeviceByUDIDOrThrow(udid: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { udid } });
    if (!device) {
      throw new NotFoundException(`Device with UDID ${udid} not found`);
    }
    return device;
  }

  async getDeviceByIDOrThrow(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }
  

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async findByUdid(udid: string): Promise<Device> {
    return this.getDeviceByUDIDOrThrow(udid);
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async update(id: number, deviceData: Partial<Device>): Promise<Device> {
    const device = await this.getDeviceByIDOrThrow(id);
    Object.assign(device, deviceData);
    return this.deviceRepository.save(device);
  }

  async updateByUdid(udid: string, deviceData: Partial<Device>): Promise<Device> {
    const device = await this.getDeviceByUDIDOrThrow(udid);
    Object.assign(device, deviceData);
    return this.deviceRepository.save(device);
  }

  async deleteByUdid(udid: string): Promise<boolean> {
    const device = await this.getDeviceByUDIDOrThrow(udid);
    if (device) {
      await this.applicationService.deleteByDeviceId(device.id);
      await this.deviceRepository.delete(device.id);
      return true;
    }
    return false;
  }
}