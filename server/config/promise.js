const { defAnswer, defAnswerError } = require("@utils");

Promise.prototype.defAnswer = function (
  res,
  errorStatus = 418,
  errorMessage,
  addons
) {
  return this.then(defAnswer(res, addons)).catch(
    defAnswerError(res, errorStatus, errorMessage)
  );
};

Promise.prototype.wait = function (time = 10000) {
  return this.then(async (data) => {
    await new Promise((resolve) => {
      setTimeout(resolve, time);
    });
    return data;
  });
};
