/**
 * Created by ssehacker on 2016/11/26.
 */

import path from 'path';
import koaRouter from 'koa-router';
import log4js from 'log4js';
import Busboy from 'busboy';
import fs from 'fs';
import uuid from 'node-uuid';
import fileType from 'file-type';
import UserDao from '../../src/dao/UserDao';
import Status from '../../src/Status';
import loadConfig from '../../src/util/loadConfig';


const router = koaRouter();
const logger = log4js.getLogger('runtime');
const userDao = new UserDao();


const config = loadConfig();

// todo: 将上传头像 和上传图片抽象. 代码有冗余了.
// 上传头像
router.post('/api/upload/photo', async (ctx) => {
  try {
    const photoPath = await new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers: ctx.req.headers });
      let photoPath2;
      const MAX_SIZE = 1024 * 1024 * 2; // 文件最大2M.
      busboy.on('file', async (fieldname, file, filename /* , encoding, mimetype*/) => {
        let saveTo;
        let type;
        let size = 0;
        file.on('data', (chunk) => {
          if (!type) {
            type = fileType(chunk);
            if (type && /image\/*/.test(type.mime)) {
              const newName = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
              saveTo = path.resolve('uploads', 'photos', newName);
              photoPath2 = `${config.cdn}/photos/${newName}`;
            } else {
              reject(Status.FileTypeError);
              return;
            }
          }
          if (type) {
            size += chunk.length;
            if (size > MAX_SIZE) {
              fs.unlinkSync(saveTo);
              reject(Status.FILE_NO_MORE_THAN_2M);
              return;
            }
            fs.appendFileSync(saveTo, chunk);
          }
        });

        file.on('end', () => {
          if (photoPath2) {
            logger.info(`File ${saveTo} Finished,${size} bytes`);
          } else {
            reject(Status.UNKNOWN_ERROR);
          }
        });
      });

      busboy.on('finish', async () => {
        if (photoPath2) {
          const res = await userDao.update({ name: ctx.session.username }, {
            $set: {
              photo: photoPath2,
            },
          });

          if (res.ok) {
            resolve(photoPath2);
          }
        } else {
          reject(Status.UNKNOWN_ERROR);
        }
      });
      ctx.req.pipe(busboy);
    });

    ctx.success({
      data: photoPath,
    });
  } catch (err) {
    logger.error(err);
    ctx.error(err);
  }
});

// 上传图片
router.post('/api/upload/image', async (ctx) => {
  try {
    const photoPath = await new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers: ctx.req.headers });
      let photoPath2;
      const MAX_SIZE = 1024 * 1024 * 4; // 文件最大4M.
      busboy.on('file', async (fieldname, file, filename /* , encoding, mimetype*/) => {
        let saveTo;
        let type;
        let size = 0;
        file.on('data', (chunk) => {
          if (!type) {
            type = fileType(chunk);
            if (type && /image\/*/.test(type.mime)) {
              const newName = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
              saveTo = path.resolve('uploads', 'images', newName);
              photoPath2 = `${config.cdn}/images/${newName}`;
            } else {
              reject(Status.FileTypeError);
              return;
            }
          }
          if (type) {
            size += chunk.length;
            if (size > MAX_SIZE) {
              fs.unlinkSync(saveTo);
              reject(Status.FILE_NO_MORE_THAN_2M);
              return;
            }
            fs.appendFileSync(saveTo, chunk);
          }
        });

        file.on('end', () => {
          if (photoPath2) {
            logger.info(`File ${saveTo} Finished,${size} bytes`);
          } else {
            reject(Status.UNKNOWN_ERROR);
          }
        });
      });

      busboy.on('finish', async () => {
        if (photoPath2) {
          resolve(photoPath2);
        } else {
          reject(Status.UNKNOWN_ERROR);
        }
      });
      ctx.req.pipe(busboy);
    });

    ctx.success({
      data: photoPath,
    });
  } catch (err) {
    logger.error(err);
    ctx.error(err);
  }
});

export default router;
