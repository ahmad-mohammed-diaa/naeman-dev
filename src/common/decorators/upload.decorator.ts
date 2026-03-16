import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

/**
 * Decorator for single file upload.
 * Uses memoryStorage — file stays as Buffer in RAM.
 * Cloudinary upload happens INSIDE the service, AFTER all business validation passes.
 * This prevents orphaned files when the function crashes.
 *
 * Controller usage:
 *   @UploadFile()
 *   @Post()
 *   create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateDto) {
 *     return this.service.create(dto, file);
 *   }
 *
 * Service usage:
 *   async create(dto, file?: Express.Multer.File) {
 *     // 1. validate first (throw here = nothing uploaded)
 *     // 2. const { url, publicId } = await this.cloudinary.upload(file.buffer, 'folder');
 *     // 3. try { await prisma.model.create(...) } catch { await this.cloudinary.delete(publicId); throw; }
 *   }
 */
export function UploadFile(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, { storage: memoryStorage() })),
    ApiConsumes('multipart/form-data'),
  );
}

/**
 * Decorator for multiple file upload.
 * Uses memoryStorage — files stay as Buffers in RAM.
 * Same pattern as UploadFile — upload to Cloudinary inside the service after validation.
 */
export function UploadFiles(fieldName = 'files', maxCount = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, { storage: memoryStorage() })),
    ApiConsumes('multipart/form-data'),
  );
}
