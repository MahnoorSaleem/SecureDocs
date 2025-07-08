import express from 'express';
import * as docController from '../controllers/document.controller';
import { upload } from '../middlewares/upload.middleware';
import { isAuth } from '../middlewares/auth.middleware';
import { validateMultipleFiles, validateSingleFile } from '../middlewares/validateFile.middleware';
import { validateParams } from '../middlewares/validate';
import { objectIdSchema } from '../validations/docs.validation';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router.post('/upload', isAuth, upload.single('file'), validateSingleFile(['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), catchAsync(docController.uploadSingle));
router.post('/upload-multiple', isAuth, upload.array('files', 5), validateMultipleFiles(['application/pdf', 'image/png', 'image/jpeg'], 10), catchAsync(docController.uploadMultiple));
router.get('/download/:id', isAuth, validateParams(objectIdSchema), catchAsync(docController.getDownloadUrl));
router.delete('delete/:id', validateParams(objectIdSchema), isAuth, catchAsync(docController.deleteFile));
// todo - Add multifile download
// todo - Add multifile deletion

export default router;
