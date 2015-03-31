var async = require('async')

module.exports = embellishObject

function embellishObject(attributes) {

  function embellishRelations(object, callback) {
    async.each(attributes, function (embellish, next) {
      // TODO: support an unlimited depth of sub-objects, currently only supports sub-objects one level deep
      var embellishSubObject = embellish.attribute.match(/^\$(.+?)\.(.+)$/)
      if (embellishSubObject) {
        var objectAttribute = embellishSubObject[1]
          , subObjectAttribute = embellishSubObject[2]
          , subObject = object[objectAttribute]

        if (Array.isArray(subObject)) {
          async.each(subObject, function (_subObject, nextSubObject) {
            embellishRelation(
              _subObject
            , subObjectAttribute
            , embellish.service
            , nextSubObject
            )
          }, next)
        } else {
          embellishRelation(
            subObject
          , subObjectAttribute
          , embellish.service
          , next
          )
        }

      } else {
        embellishRelation(object, embellish.attribute, embellish.service, next)
      }
    }, function (err) {
      callback(err, object)
    })
  }

  function embellishRelation(object, attribute, service, callback) {
    var relatedId = object[attribute]
      , embellishedAttributeName = '_' + attribute.replace(/Id$/, '')

    if (typeof relatedId === 'undefined') {
      return callback(new Error('Invalid embellish attribute "' + attribute + '"'))
    }

    if (!relatedId || !(relatedId + '').length) {
      return callback(null, object)
    }

    // relations can be a single id or array of ids
    if (Array.isArray(relatedId)) {
      service.find({ _id: { $in: relatedId } }, {}, addEmbellishedRelation)
    } else {
      service.read(relatedId, addEmbellishedRelation)
    }

    function addEmbellishedRelation(err, result) {
      if (err) return callback(err)
      //if (Array.isArray(result)) {
      //  result.sort(sortByName)
      //}
      object[embellishedAttributeName] = result
      callback(null, object)
    }
  }

  return embellishRelations
}

//function sortByName(a, b) {
//  return a.name.localeCompare(b.name)
//}
