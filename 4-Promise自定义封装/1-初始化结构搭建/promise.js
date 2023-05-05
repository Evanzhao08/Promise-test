function Promise(executor) {
  //添加属性
  this.PromiseState = 'pending'
  this.PromiseResult = null
  //声明属性
  this.callback = []
  const self = this //self _this that
  function resolve(data) {
    //判断
    if (self.PromiseState !== 'pending') return
    // 1.修改对象的状态(promiseState)
    self.PromiseState = 'fulfilled'
    // 2.设置对象结果值(promiseResult)
    self.PromiseResult = data
    self.callback.forEach((item) => {
      item.onResolved(data)
    })
  }

  function reject(data) {
    //判断
    if (self.PromiseState !== 'pending') return
    self.PromiseState = 'rejected'
    self.PromiseResult = data
    // if (self.callback.onRejected){
    //     self.callback.onRejected(data);
    // }
    self.callback.forEach((item) => {
      item.onRejected(data)
    })
  }
  try {
    //同步调用 【执行器函数】
    executor(resolve, reject)
  } catch (e) {
    //修改promise对象状态为【失败】
    reject(e)
  }
}

//添加then 方法

Promise.prototype.then = function (onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    //调用回调函数  PromiseState
    if (this.PromiseState === 'fulfilled') {
      try {
        let result = onResolved(this.PromiseResult)
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v)
            },
            (r) => {
              reject(r)
            }
          )
        } else {
          //结果的对象状态为【成功】
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }
    if (this.PromiseState === 'rejected') {
      onRejected(this.PromiseResult)
    }
    //判断pending状态
    if (this.PromiseState === 'pending') {
      //保存回调函数
      this.callback.push({
        onResolved: onResolved,
        onRejected: onRejected,
      })
    }
  })
}
