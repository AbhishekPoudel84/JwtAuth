import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "./entities/file.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>
  ) {}
  async saveFileUpload(fileUpload) {
    return this.fileUploadRepository.save(fileUpload);
  }

  async getFileByIds(fileIds) {
    return this.fileUploadRepository.find({
      where: {
        id: In([...fileIds]),
      },
    });
  }
}
