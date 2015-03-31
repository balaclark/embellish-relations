# Embellish Relations

Embellishes objects with full relational data.

## Relation Mapping

Id relations attributes are mapped to services. A service must contain both a
`read` and `find` method (as provided by https://github.com/serby/crud-service).

Given the following configuration:

```js
var relations = [ { attribute: 'locationId', service: locationService } ]
```

The following object:
```js
{ name: 'Test'
, locationId: 1
}
```

becomes:
```js
{ name: 'Test'
, locationId: 1
, _location:
  { _id: 1
  , city: 'London'
  , country: 'England'
  }
}
```

## Usage

### Embellish a single object

```js
var embellishObjectRelations = require('embellish-relations').embellishObject
  , embellishRelations = embellishObjectRelations(
    [ { attribute: 'locationId', service: locationService }
    ])

embellishRelations(object, function (err, embellished) {
  // 'embellished' is an updated 'object' with all specified relations added
})
```

### Embellish the result of a function call

```js
var embellishRelations = require('embellish-relations')
  , relations =
    [ { attribute: 'locationId', service: locationService }
    ]
  , read = embellishRelations(locationService.read, relations)
  , find = embellishRelations(locationService.find, relations)

read(id, function (err, embellished) {
  // 'embellished' is a single object with all specified relations added
})

find(query, options, function (err, embellished) {
  // 'embellished' is an array of objects with all specified relations added
})
```
