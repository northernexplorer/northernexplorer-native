import { Collection } from "@mikro-orm/core";
import { Entity,PrimaryKey,Index,Property } from "@mikro-orm/decorators/legacy";
import { Country } from "./Country";


@Entity()
@Index({ name: 'idx_site_location', properties: ['name'] })
export class Region{

@PrimaryKey({type:'string'})
id!:string


@Property({type:'number',version:true,default:1})
version!:number


@Property({type:'string',length:255})
name!:string


country = new Collection<Country>(this)



}