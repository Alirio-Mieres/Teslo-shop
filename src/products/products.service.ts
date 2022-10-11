import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';

//yarn add -D @types/uuid
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
@Injectable()
export class ProductsService {

  //me ayuda a ver los errores en mas detalle
  private readonly logger = new Logger('ProductService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}
  

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...producDetail} = createProductDto;

      //crea una instancia del producto 
      const product = this.productRepository.create({
        ...producDetail,
        images: images.map( images => this.productImageRepository.create({ url: images }))
      }); 
      //guarda en la base de datos
      await this.productRepository.save(product);
      
      return {...product, images};
      
    } catch (error) {
      this.handleDBExeceptions(error);
    }
  }



  //Todo: paginar
  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( image => image.url)
    }));

  }


  async findOne(term: string) {   
    let product: Product;

    if( isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    } else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      
      product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug', {
        title : term.toUpperCase(),
        slug : term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }
    
    if( !product ) 
      throw new NotFoundException(`Product with id ${ term } not found`);
    return product;
  }


  async findOnePlain( term: string){
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map( images=> images.url)
    }
  }



  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    });

    if( !product ) 
      throw new NotFoundException(`Product with id: ${id} not found`);
    

    //create queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      if(images){
        await queryRunner.manager.delete( ProductImage, {product: { id }} );

        product.images = images.map(
          image => this.productImageRepository.create({url: image})
        )
      } else{

      }

      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      // await  this.productRepository.save(product);
      return this.findOnePlain( id );
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExeceptions(error);
    }


  }



  async remove(id: string) {
    const product = await this.findOne( id );
    return await this.productRepository.remove( product );
  }




  private handleDBExeceptions( error: any){
    
    if( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs!")
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExeceptions(error);
    }
  }


}



