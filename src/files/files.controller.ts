import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


  @Post('product')
  @UseInterceptors( FileInterceptor('') )
  uploadImagesProduct( 
    @UploadedFile() file: Express.Multer.File 
    ){
    return file;
  }

}