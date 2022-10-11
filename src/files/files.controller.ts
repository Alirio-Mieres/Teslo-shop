import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helper/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter
  }) )
  uploadImagesProduct( 
    @UploadedFile() file: Express.Multer.File 
    ){
    
      if( !file){
        throw new BadRequestException('Make sure that file is an image');
      }

      console.log({ fileInController: file })

    return{
      fileName: file.originalname
    } ;
  }

}
