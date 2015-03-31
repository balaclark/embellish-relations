var assert = require('assert-diff')
  , embellishFunction = require('../lib/embellish-function')
  , mockService = require('./mock-service')
  , fixtures = require('./fixtures/service')

describe('#embellishFunction()', function () {

  it('should embellish results from a function that returns a single object', function (done) {
    var read = embellishFunction(mockService.read
        , [ { attribute: 'relationId', service: mockService } ])
      , expected = fixtures(1)

    expected._relation = fixtures(3)

    read(1, function (err, embellished) {
      if (err) return done(err)
      assert.deepEqual(embellished, expected)
      done()
    })
  })

  it('should embellish results from a function that returns an array of objects', function (done) {
    var find = embellishFunction(mockService.find
        , [ { attribute: 'relationId', service: mockService } ])
      , expected = fixtures(4)

    expected._relation = [ fixtures(1), fixtures(2), fixtures(3) ]

    find({ _id: { $in: [ 4 ] } }, {}, function (err, embellished) {
      if (err) return done(err)
      assert.deepEqual(embellished[0], expected)
      done()
    })
  })

})
