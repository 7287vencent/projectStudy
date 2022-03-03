class Promise {
  constructor(executor) {
    // Promise存在三个状态（state）pending、fulfilled、rejected
    // pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
    // 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
    // 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  // Promise有一个叫做then的方法，里面有两个参数：onFulfilled,onRejected,成功有成功的值，失败有失败的原因
  // onFulfilled,onRejected如果他们是函数，则必须分别在fulfilled，rejected后被调用，value或reason依次作为他们的第一个参数
  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    // 为了解决链式调用, 默认在第一个then里返回一个新的promise -> promise2, 将这个promise2返回的值传递到下一个then中
    // 声明返回的promise2
    const promise2 = new Promise((resolve, reject) => {
      // 当我们在第一个then中return了一个参数（参数未知，需判断）。这个return出来的新的promise就是onFulfilled()或onRejected()的值
      // onFulfilled()或onRejected()的值，即第一个then返回的值, 第一个then返回的值，叫做x，判断x的函数叫做resolvePromise
      if (this.state === "fulfilled") {
        // onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // resolvePromise函数，处理自己return的promise和默认的promise2的关系
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        // onFulfilled或onRejected不能同步被调用，必须异步调用。我们就用setTimeout解决异步问题
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    // 返回promise，完成链式
    return promise2;
  }
  catch(fn) {
    return this.then(null, fn);
  }
}

// 首先，要看x是不是promise。
// 如果是promise，则取它的结果，作为新的promise2成功的结果
// 如果是普通值，直接作为promise2成功的结果
// 所以要比较x和promise2
// resolvePromise的参数有promise2（默认返回的promise）、x（我们自己return的对象）、resolve、reject
// resolve和reject是promise2的
// x 是普通值 直接resolve(x) x 是对象或者函数（包括promise），let then = x.then
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次调用
  let called;
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then;
      if (typeof then === "function") {
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e);
    }
  } else {
    resolve(x);
  }
}
// resolve方法
Promise.resolve = function (val) {
  return new Promise((resolve, reject) => {
    resolve(val);
  });
};
// reject方法
Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};
// race方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
// all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function (promises) {
  let arr = [];
  let i = 0;
  function processData(index, data) {
    arr[index] = data;
    i++;
    if (i == promises.length) {
      resolve(arr);
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then((data) => {
        processData(i, data);
      }, reject);
    }
  });
};
// finally方法 当前promise 对象调用完成，，不管状态是成功还是失败
Promise.prototype.finally = function (cb) {
  let P = this.constructor;
  return this.then(
    (value) => {
      P.resolve(cb()).then(() => value);
    },
    (reason) => {
      P.resolve(cb()).then(() => {
        throw reason;
      });
    }
  );
};
// retry方法 重试方法
Promise.retry = function (fn, times, delay) {
  return new Promise((resolve, reject) => {
    var error;
    var tryFun = function () {
      if (times === 0) {
        reject(error);
      }
      fn()
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          times--;
          error = e;
          setTimeout(() => {
            tryFun();
          }, delay);
        });
    };
    tryFun();
  });
};

module.exports = { Promise };


// 测试代码
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
