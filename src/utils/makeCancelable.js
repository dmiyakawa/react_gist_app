/*
 * https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
 */
const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  return {
    promise: new Promise(
      (resolve, reject) => promise
        .then(r => hasCanceled_
          ? reject({isCanceled: true})
          : resolve(r)
        )
    ),
    cancel() {
      hasCanceled_ = true;
    }
  };
};

module.exports = makeCancelable
