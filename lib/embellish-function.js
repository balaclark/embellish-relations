var async = require('async')
  , makeObjectRelationEmbellisher = require('./embellish-object-relations')

module.exports = embellish

function embellish(originalFunction, attributes) {
  var embellishObjectRelations = makeObjectRelationEmbellisher(attributes)

  function embellishedFunction() {
    var args = Array.prototype.slice.call(arguments)

    // FIXME:
    // this assumes that only one function argument is passed in and that it is
    // meant to be a callback, this is likely not a good idea
    args.forEach(function replaceCallback(arg, i) {
      if (typeof arg === 'function') {
        args[i] = function (err, result) {
          // FIXME this is a bit ugly and will likely need refactoring, but it does fix the race condition
          embellishFunction(err, result, args, arg)
        }
      }
    })

    originalFunction.apply(originalFunction, args)
  }

  function embellishFunction(err, result, args, callback) {
    if (err) return callback(err)
    if (!result) return callback(null, result)

    if (!Array.isArray(result)) {
      return embellishObjectRelations(result, callback)
    }

    var embellishedObjects = []

    // eachSeries is slightly slower, but maintains the returned order
    async.eachSeries(result
    , function (object, next) {
        embellishObjectRelations(object, function (err, embellishedObject) {
          if (err) return next(err)
          embellishedObjects.push(embellishedObject)
          next()
        })
      }
    , function (err) {
        // FIXME
        // this code makes an assumption that if a count function is present it
        // should be called and that its results should be returned in the original
        // callback, this is probably a hacky way of doing it.
        if (typeof originalFunction.count === 'function') {
          originalFunction.count(args[0], {}, function (err, count) {
            callback(err, embellishedObjects, count)
          })
        } else {
          callback(err, embellishedObjects)
        }
      }
    )
  }

  return embellishedFunction
}
