module.exports = function getData(index) {
  var data =
    [ { id: 0
      , name: 'Zero'
      }
    , { id: 1
      , name: 'One'
      , relationId: 3
      }
    , { id: 2
      , name: 'Two'
      , relationId: 1
      }
    , { id: 3
      , name: 'Three'
      , relationId: 2
      }
    , { id: 4
      , name: 'Four'
      , relationId: [ 1, 2, 3 ]
      }
    , { id: 5
      , name: 'Five'
      , relationOne: 1
      , relationTwoId: 2
      }
    , { id: 6
      , name: 'Six'
      , nestedObject:
        { name: 'Six 1'
        , relationId: 1
        }
      , nestedArray:
        [ { name: 'Six 2'
          , relationId: 2
          }
        , { name: 'Six 3'
          , relationId: 3
          }
        ]
      }
    ]

  return index ? data[index] : data
}
