import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { HistoricSite } from '../entities/HistoricSite.js';

interface HistoricSiteRawRow {
    id: number;
    name: string;
    description: string;
    image: string | null;
    lat: string | number;
    lon: string | number;
    country: string;
    region: string;
    distanceMeters: number;
}

export class HistoricSiteController {

    /**
     * Fetches the 3 closest historic sites relative to the provided coordinates.
     */
    public static async getNearbyHistoricSites(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Coordinates safely populated by your validateCoords validation validateCoords.ts
            const lat = res.locals.lat;
            const lon = res.locals.lon;

            const em = RequestContext.getEntityManager()!;

            // Use the Haversine formula inside a subquery to calculate exact distances in meters
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
                    LIMIT 3
            `;

            // Cast raw rows through unknown to enforce compile-time types
            const rawResults = (await em.getConnection().execute(query, [lat, lon, lat])) as unknown as HistoricSiteRawRow[];

            // Types are now cleanly inferred inside the map loop definition
            const formattedSites = rawResults.map((site) => ({
                id: site.id,
                name: site.name,
                description: site.description,
                image: site.image,
                country: site.country,
                region: site.region,
                coordinates: {
                    latitude: Number(site.lat),
                    longitude: Number(site.lon)
                },
                distance_offset_meters: Math.round(site.distanceMeters)
            }));

            res.json({
                source: "database_records",
                count: formattedSites.length,
                sites: formattedSites
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Fetches a single specific historic site by its unique ID record identifier.
     */
    public static async getHistoricSiteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query.id || req.params.id;

            if (!id) {
                res.status(400).json({ error: "Missing required identifier parameters 'id'." });
                return;
            }

            const em = RequestContext.getEntityManager()!;
            const site = await em.findOne(HistoricSite, { id: Number(id) });

            if (!site) {
                res.status(404).json({ error: "Historic site record not found." });
                return;
            }

            res.json({
                id: site.id,
                name: site.name,
                description: site.description,
                image: site.image,
                country: site.country,
                region: site.region,
                coordinates: {
                    latitude: Number(site.lat),
                    longitude: Number(site.lon)
                }
            });

        } catch (error) {
            next(error);
        }
    }
}