import { Entity,PrimaryKey,Index,Property, OneToMany } from "@mikro-orm/decorators/legacy";
import { Region } from "./Region";
import { Collection } from "@mikro-orm/core";

@Entity()
// @Index({ name: 'idx_site_location', properties: ['name'] })

export class Country{

@PrimaryKey({type:'string'})
id!:string


@Property({type:'number',version:true,default:1})
version!:number


@Property({type:'string',length:255})
name!:string

@OneToMany(() => Region,region => region.country)
regions = new Collection<Region>(this)



}