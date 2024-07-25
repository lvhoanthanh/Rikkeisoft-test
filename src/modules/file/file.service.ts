import { Injectable } from '@nestjs/common';
import { FileEntity } from '../../models/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Constants } from '../../helpers/constants';

import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';
import {extname, join} from "path";
import {CommonHelper} from "../../helpers/common";
var fs = require('fs');

@Injectable()
export class FileService extends TransactionFor<FileService> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  public async findById(id: string): Promise<FileEntity | null> {
    return this.fileRepository.createQueryBuilder('files')
      .where("files.id = :id", { id })
      .getOne();
  }

  public async uploadFileInternal(file: any, folder: string = null): Promise<FileEntity | null> {
    const { buffer, originalname } = file;
    const uploadPublicFileInternal = await this.uploadPublicFileInternal(buffer, originalname, folder)

    const dataProcess = {
      nameOriginal: uploadPublicFileInternal.originalName,
      nameConvert: uploadPublicFileInternal.convertName,
      path: uploadPublicFileInternal.path,
      extension: extname(file.originalname),
      size: file.size,
      storageService: Constants.STORAGE_SERVICES.INTERNAL,
    };

    const result = await this.fileRepository.save(dataProcess);
    return await this.findById(result.id)
  }

  public async uploadPublicFileInternal(
    dataBuffer: Buffer,
    originalName: string,
    folder: string
  ) {
    const name = (originalName.split('.')[0]);
    const nameStandardForm = name.normalize('NFKD').replace(/[^\w]/g, '')
    const nameKey = nameStandardForm.replace(/\s+/g, '');
    const extension = extname(originalName);
    const dateTime = CommonHelper.formatCurrentTime();
    const convertName = `${nameKey}_${dateTime}${extension}`

    if (folder) {
      var dir = join(__dirname, '../../..', 'src' ,'storage', folder);
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    }

    const path = folder
      ? `${folder}/${convertName}`
      : `${convertName}`;

    const storageFolderPath = join(__dirname, '../../..', 'src' ,'storage', path);
    await fs.writeFileSync(storageFolderPath, dataBuffer);

    return {
      originalName,
      convertName,
      path
    }
  }
}
