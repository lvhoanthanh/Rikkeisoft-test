import { Controller } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('/api/files')
export class FileController {
  public constructor(
    readonly fileService: FileService
  ) {}
}
