export const m20260710bc: string[] = [
    `ALTER TABLE "subscription_level" ADD COLUMN "cost" double precision;`,
    `UPDATE "subscription_level" SET "cost" = 0.00 WHERE "name" = 'Pathfinder';`,
    `UPDATE "subscription_level" SET "cost" = 3.99 WHERE "name" = 'Explorer';`,
    `UPDATE "subscription_level" SET "cost" = 6.99 WHERE "name" = 'Trailblazer';`,
    `UPDATE "subscription_level" SET "cost" = 9.99 WHERE "name" = 'Pioneer';`,
    `UPDATE "subscription_level" SET "cost" = 12.99 WHERE "name" = 'Legend';`,
    `UPDATE "subscription_level" SET "cost" = 0.00 WHERE "cost" IS NULL;`,
    `ALTER TABLE "subscription_level" ALTER COLUMN "cost" SET NOT NULL;`,
];
