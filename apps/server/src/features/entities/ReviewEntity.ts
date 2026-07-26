import { Entity,Enum,ManyToOne,PrimaryKey,Property } from "@mikro-orm/decorators/legacy";
import { v4 } from "uuid";
import { User } from "../../user";
import { HistoricSite } from "../../location";
import { ReviewRatingEnum } from "@northernexplorer/types";

@Entity()




export class Review{
   @PrimaryKey({type:"uuid"})
   id = v4();

   @Property({type:'number', version:true})
   version = 1;

   @ManyToOne(() => User)
   user!:User;

   @Property({type:'datetime'})
   createdAt = new Date();
   @Property({type:'datetime'})
   updatedAt = new Date();
    @ManyToOne(() => HistoricSite)
     HistoricSite!: HistoricSite;

   @Enum(()=> ReviewRatingEnum)
   rating!: ReviewRatingEnum;

}