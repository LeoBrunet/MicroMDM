import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async findByDeviceAndIdentifier(deviceId: number, identifier: string): Promise<Application> {
    return this.applicationRepository.findOne({
      where: { deviceId, identifier },
    });
  }

  async createOrUpdate(appData: Partial<Application>): Promise<Application> {
    const existing = await this.findByDeviceAndIdentifier(
      appData.deviceId,
      appData.identifier,
    );

    if (existing) {
      await this.applicationRepository.update(existing.id, appData);
      return this.applicationRepository.findOne({ where: { id: existing.id } });
    } else {
      const app = this.applicationRepository.create(appData);
      return this.applicationRepository.save(app);
    }
  }

  async updateManagedState(deviceId: number, identifier: string, isManaged: boolean): Promise<Application> {
    const app = await this.findByDeviceAndIdentifier(deviceId, identifier);
    if (app) {
      app.isManaged = isManaged;
      return this.applicationRepository.save(app);
    }
    return null;
  }
}