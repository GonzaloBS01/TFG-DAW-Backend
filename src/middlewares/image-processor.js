import sharp from 'sharp';

/**
 * Middleware que recibe los archivos subidos por multer (req.files),
 * los comprime con sharp a máximo 800x800 en JPEG y los convierte a base64.
 * Inyecta los resultados en req.body.image (primera imagen) y req.body.images (array completo).
 */
export async function imageProcessor(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      // No hay archivos nuevos, continuamos sin procesar
      return next();
    }

    const processedImages = [];

    for (const file of req.files) {
      const compressedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();

      const base64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
      processedImages.push(base64);
    }

    // Inyectamos en el body para que el controlador los guarde normalmente
    req.body.images = processedImages;
    req.body.image = processedImages[0] || req.body.image || '';

    next();
  } catch (error) {
    error.status = 400;
    error.message = `Error procesando imágenes: ${error.message}`;
    next(error);
  }
}
