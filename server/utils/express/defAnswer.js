const defAnswer = (res, addons) => (data) => {
  if (typeof res?.send === "function") {
    if (typeof data?.toJSON === "function") {
      data = data.toJSON();
    }
    if (data?.createdAt) {
      delete data.createdAt;
    }
    if (data?.updatedAt) {
      delete data.updatedAt;
    }
    if (Array.isArray(data?.rows)) {
      data.rows = data.rows.map((i) => {
        let data = i;
        if (typeof data?.toJSON === "function") {
          data = data.toJSON();
        }
        if (data?.createdAt) {
          delete data.createdAt;
        }
        if (data?.updatedAt) {
          delete data.updatedAt;
        }
        return data;
      });
    }
    res.json(
      data ? (addons ? { ...data, ...addons } : data) : { ok: true, ...addons }
    );
  }
};

const defAnswerError =
  (res, errorStatus = 418, errorMessage) =>
  (err) => {
    const codeId = Math.trunc(Math.random() * 1000);
    console.error(["API", codeId], err?.message ?? err, "\n\n", err?.stack);
    if (errorMessage) {
      console.error(["API EX", codeId], errorMessage);
    }

    if (typeof res?.status === "function") {
      res.status(errorStatus ?? 500).send(
        errorMessage || {
          message: err?.message ?? codeId,
          code: codeId,
        }
      );
    }
  };

module.exports = { defAnswer, defAnswerError };
