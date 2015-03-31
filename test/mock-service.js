var data = require('./fixtures/service')

module.exports = { read: read, find: find }

function read(id, cb) {
  cb(null, data(id))
}

function find(query, options, cb) {
  var results = query._id.$in.map(function (id) {
    return data(id)
  })
  cb(null, results)
}
