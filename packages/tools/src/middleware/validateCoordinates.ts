import { Request, Response, NextFunction } from 'express';

export const validateCoordinates = (req: Request, res: Response, next: NextFunction): void => {
  const { lat, lon } = req.query;

  // Ensure both parameters are present
  if (lat === undefined || lon === undefined) {
    res.status(400).json({
      error:
        "Missing required location parameters. Please provide both 'lat' and 'lon' query parameters.",
    });
    return;
  }

  // Parse into numbers
  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lon as string);

  // Validate that they are valid numbers (not NaN)
  if (isNaN(latitude) || isNaN(longitude)) {
    res.status(400).json({
      error:
        "Invalid coordinates structure. 'lat' and 'lon' parameters must be valid decimal numbers.",
    });
    return;
  }

  // Enforce realistic global geographic coordinate boundaries
  if (latitude < -90 || latitude > 90) {
    res
      .status(400)
      .json({ error: 'Latitude coordinate value must be between -90 and 90 degrees.' });
    return;
  }

  if (longitude < -180 || longitude > 180) {
    res
      .status(400)
      .json({ error: 'Longitude coordinate value must be between -180 and 180 degrees.' });
    return;
  }

  // Store parsed coordinates in res.locals for controllers to consume safely
  res.locals.lat = latitude;
  res.locals.lon = longitude;

  next();
};
