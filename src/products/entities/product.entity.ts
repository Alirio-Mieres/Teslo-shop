import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';



@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '023c051c-4b84-4bf6-9955-1c7a8ac0dc41',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;


    @ApiProperty({
        example: 0,
        description: 'Product Price',

    })
    @Column('float',{
        default: 0
    })
    price: number;


    @ApiProperty({
        example: 'description',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;


    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;


    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number;


    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product sizes'
    })
    @Column('text',{
        array: true
    })
    sizes: string[];


    @ApiProperty({
        example: 'women',
        description: 'Product gender',
        uniqueItems: true
    })
    @Column('text')
    gender: string;


    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];

    
    // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    
    @ManyToOne(
        () => User,
        (user) => user.product
    )
    user: User



    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    //manera de limpiar los slug 2
      // if( !createProductDto.slug ){
      //   createProductDto.slug = createProductDto.title
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '')
      // } else {
      //   createProductDto.slug = createProductDto.slug
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '')
      // }

}
