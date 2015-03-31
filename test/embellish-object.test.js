var assert = require('assert-diff')
  , embellishObjectRelations = require('../lib/embellish-object-relations')
  , mockService = require('./mock-service')
  , fixtures = require('./fixtures/service')

describe('#embellishObjectRelations()', function () {

  it('should embellish an object', function (done) {
    var embellishRelations = embellishObjectRelations(
        [ { attribute: 'relationId', service: require('./mock-service') }
        ])
      , expected = fixtures(1)

    expected._relation = fixtures(3)

    embellishRelations(fixtures(1), function (err, embellished) {
      if (err) return done(err)
      assert.deepEqual(embellished, expected)
      done()
    })
  })

  it('should embellish multiple relations stored as an array', function (done) {
    var embellishRelations = embellishObjectRelations(
        [ { attribute: 'relationId', service: require('./mock-service') }
        ])
      , expected = fixtures(4)

    expected._relation = [ fixtures(1), fixtures(2), fixtures(3) ]

    embellishRelations(fixtures(4), function (err, embellished) {
      if (err) return done(err)
      assert.deepEqual(embellished, expected)
      done()
    })
  })

  it('should support relations with and without an "Id" postfix', function (done) {
    var embellishRelations = embellishObjectRelations(
        [ { attribute: 'relationOne', service: mockService }
        , { attribute: 'relationTwoId', service: mockService }
        ])
      , expected = fixtures(5)

    expected._relationOne = fixtures(1)
    expected._relationTwo = fixtures(2)

    embellishRelations(fixtures(5), function (err, embellished) {
      if (err) return done(err)
      assert.deepEqual(embellished, expected)
      done()
    })
  })

  it('should return an error if a non-existent relation attribute is used', function (done) {
    var embellishRelations = embellishObjectRelations(
      [ { attribute: 'foo', service: mockService }
      ])

    embellishRelations({}, function (err) {
      assert.equal(err.message, 'Invalid embellish attribute "foo"')
      done()
    })
  })

  describe('nested relations', function () {

    it('should support nested objects', function (done) {
      var embellishRelations = embellishObjectRelations(
          [ { attribute: '$nestedObject.relationId', service: mockService }
          ])
        , expected = fixtures(6)

      expected.nestedObject._relation = fixtures(1)

      embellishRelations(fixtures(6), function (err, embellished) {
        if (err) return done(err)
        assert.deepEqual(embellished, expected)
        done()
      })
    })

    it('should support nested arrays', function (done) {
      var embellishRelations = embellishObjectRelations(
          [ { attribute: '$nestedArray.relationId', service: mockService }
          ])
        , expected = fixtures(6)

      expected.nestedArray[0]._relation = fixtures(2)
      expected.nestedArray[1]._relation = fixtures(3)

      embellishRelations(fixtures(6), function (err, embellished) {
        if (err) return done(err)
        assert.deepEqual(embellished, expected)
        done()
      })
    })

    it('should support multiple levels of nesting')

  })
})
