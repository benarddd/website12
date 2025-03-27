import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { fileURLToPath } from 'url';

// Sigurimi i direktorisë së ngarkimeve (për ESM modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../public/uploads');

// Krijojmë direktorinë nëse nuk ekziston
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Skema e validimit për të dhënat e imazhit
const uploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileData: z.string().min(1), // base64 string
});

/**
 * Validimi i lojeve të dosjeve të lejuara
 */
function isValidFileType(fileType: string): boolean {
  // Lejoj vetëm imazhe të sigurta
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(fileType);
}

/**
 * Ruajt një file të ngarkuar nga përdoruesi
 */
function saveFile(fileData: string, fileType: string): string {
  // Gjenero një emër të sigurt dhe random për file
  const randomName = crypto.randomBytes(16).toString('hex');
  const extension = fileType.split('/')[1];
  const fileName = `${randomName}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);

  // Konverto base64 në binary dhe ruaje
  const base64Data = fileData.replace(/^data:.*?;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');

  // Kthen URL-në relative për t'u përdorur në front-end
  return `/uploads/${fileName}`;
}

// Ruteri për ngarkimin e imazheve
export const uploadRouter = Router();

uploadRouter.post('/upload-image', async (req: Request, res: Response) => {
  try {
    console.log('Kërkesë e re për ngarkimin e imazhit');
    
    // Validimi i hyrjes
    const validatedData = uploadSchema.parse(req.body);
    
    // Verifikim i mëtejshëm i sigurisë
    if (!isValidFileType(validatedData.fileType)) {
      console.error('Lloj i pavlefshëm i filet:', validatedData.fileType);
      return res.status(400).json({
        success: false,
        message: 'Lloji i filet nuk lejohet. Vetëm .jpg, .png, .gif dhe .webp janë të lejuara.'
      });
    }
    
    // Ruajtja e filet dhe marrja e URL
    const fileUrl = saveFile(validatedData.fileData, validatedData.fileType);
    
    console.log('Imazhi u ngarkua me sukses:', fileUrl);
    
    // Kthehem përgjigjen me URL-në e imazhit të ngarkuar
    res.status(200).json({
      success: true,
      url: fileUrl
    });
  } catch (error) {
    console.error('Gabim në ngarkimin e imazhit:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Të dhënat e imazhit nuk janë valide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ka ndodhur një gabim gjatë ngarkimit të imazhit'
    });
  }
});

export default uploadRouter;