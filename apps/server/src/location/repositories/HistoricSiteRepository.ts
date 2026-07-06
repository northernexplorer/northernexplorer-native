import { HistoricSite } from '../entities/HistoricSite';
import { EntityRepository } from '@mikro-orm/postgresql';

interface HistoricSiteRawRow {
    id: number;
    name: string;
    description: string;
    image: string;
    lat: string | number;
    lon: string | number;
    country: string;
    region: string;
    distanceMeters: number;
}

export class HistoricSiteRepository extends EntityRepository<HistoricSite> {
    async getHistoricSiteDetails(id: number) {
        const site = await this.em.findOne(HistoricSite, { id: Number(id) });

        if (!site) throw new Error('Historic site not found.');

        return {
            id: site.id,
            name: site.name,
            description: site.description,
            image: site.image,
            country: site.country,
            region: site.region,
            coordinates: {
                latitude: Number(site.lat),
                longitude: Number(site.lon),
            },
        };
    }

    async getClosestHistoricSites(lat: number, lon: number) {
        const query = `
                SELECT id, name, description, image, lat, lon, country, region, distance_meters as distanceMeters
                FROM (
                         SELECT id, name, description, image, lat, lon, country, region,
                                (6371000 * acos(
                                        cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) +
                                        sin(radians(?)) * sin(radians(lat))
                                           )) AS distance_meters
                         FROM historic_site
                     ) AS spatial_search
                ORDER BY distanceMeters ASC
                    LIMIT 5
            `;

        const rawResults = (await this.em
            .getConnection()
            .execute(query, [lat, lon, lat])) as unknown as HistoricSiteRawRow[];

        return rawResults.map((site) => ({
            id: site.id,
            name: site.name,
            description: site.description,
            image: site.image,
            country: site.country,
            region: site.region,
            coordinates: {
                latitude: Number(site.lat),
                longitude: Number(site.lon),
            },
        }));
    }
}
