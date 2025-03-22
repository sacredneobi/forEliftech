const models = require("@models");
const { mediaPath } = require("../file");

const getData = (path, data) => {
  if (path.includes(".")) {
    return path.split(".").reduce((p, i) => {
      return p?.[i];
    }, data);
  }
  return data?.[path];
};

const checkVal = (fields, place) => {
  if (!Array.isArray(fields)) {
    throw new Error("Fields is not array");
  }

  return (req, res, next) => {
    const checkData = req[place] ? req[place] : {};

    const checkArr = fields.filter((item) => !getData(item, checkData));

    if (checkArr.length > 0) {
      res.status(500).send({
        error: true,
        message: `Not found "${checkArr.join(", ")}" in request. "${place}"`,
      });
      return;
    }
    next();
  };
};

const mediaMiddleware = async (req, res, next) => {
  if (typeof req.body?.data === "string") {
    try {
      req.body = JSON.parse(req.body?.data);
      if (!req.body.media) {
        req.body.media = [];
      }
    } catch (err) {}
  }

  req.newFiles = [];

  req.saveFile = async (props) => {
    if (req.newFiles?.length > 0) {
      await Promise.all(
        req.newFiles?.map?.((item) =>
          models.media.create({ ...item, ...props })
        )
      );
    }
  };

  req.deleteFile = async (props) => {
    await models.media.destroy({ where: { id: props } });
  };

  req.workFile = async (data, deleteId) => {
    if (req.newFiles?.length > 0) {
      await Promise.all(
        req.newFiles?.map?.((item) => models.media.create({ ...item, ...data }))
      );
    }
    if (deleteId?.length > 0) {
      await models.media.destroy({ where: { id: deleteId } });
    }
  };

  if (req.files && Object.keys(req.files).length > 0) {
    for (const key in req.files) {
      const item = req.files[key];

      const fileName = mediaPath + item.md5;

      try {
        await item.mv(fileName);

        req.newFiles.push({
          fileId: item.md5,
          name: item.name,
          size: item.size,
          mimeType: item.mimetype,
          fileName,
        });
      } catch (err) {}
    }
  }

  next();
};

module.exports = { checkVal, mediaMiddleware };
