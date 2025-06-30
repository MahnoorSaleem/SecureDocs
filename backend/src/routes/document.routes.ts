import express from 'express';
import * as docController from '../controllers/document.controller';
import { upload } from '../middlewares/upload.middleware';
import { isAuth } from '../middlewares/auth.middleware';
import { validateMultipleFiles, validateSingleFile } from '../middlewares/validateFile.middleware';
import { validateParams } from '../middlewares/validate';
import { objectIdSchema } from '../validations/docs.validation';

const router = express.Router();

router.post('/upload', isAuth, upload.single('file'), validateSingleFile(['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), docController.uploadSingle);
router.post('/upload-multiple', isAuth, upload.array('files', 5), validateMultipleFiles(['application/pdf', 'image/png', 'image/jpeg'], 10), docController.uploadMultiple);
router.get('/download/:id', isAuth, validateParams(objectIdSchema), docController.getDownloadUrl);
router.delete('/:id', validateParams(objectIdSchema), isAuth, docController.deleteFile);
// todo - Add multifile download
// todo - Add multifile deletion

export default router;
