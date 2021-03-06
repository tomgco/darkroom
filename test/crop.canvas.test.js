var CropCanvas = require('../lib/canvas/crop')
  , fs = require('fs')
  , Canvas = require('canvas')
  , mkdirp = require('mkdirp')
  , join = require('path').join
  , tmp = join(__dirname, 'fixtures', 'temp')
  , imageFixture = fs.readFileSync(join(__dirname, 'fixtures', 'bill.png'))
  , Image = Canvas.Image
  , async = require('async')
  , assert = require('assert')

if (!fs.existsSync(tmp)) {
  mkdirp(tmp)
}

var dataProvider =
  [ [100, 100, {xOffset: 0, yOffset: 0}]
  , [200, 100, {xOffset: 0, yOffset: 0}]
  , [100, 200, {xOffset: 0, yOffset: 0}]
  , [-100, 100, {xOffset: 0, yOffset: 0}]
  , [100, -100, {xOffset: 0, yOffset: 0}]
  , [-100, -100, {xOffset: 0, yOffset: 0}]
  , [0x10, 0x8, {xOffset: 0, yOffset: 0}]
  , [0, 0, {xOffset: 0, yOffset: 0}]
  , [100, 0, {xOffset: 0, yOffset: 0}]
  , [-100, 0, {xOffset: 0, yOffset: 0}]
  , [0, -100, {xOffset: 0, yOffset: 0}]
  , [0, 100, {xOffset: 0, yOffset: 0}]
  // , [100, 1000] How to implement this case without causing crazy code?
  ]

describe('CropCanvas', function() {

  it('should treat negative numbers as positive', function (done) {
    var canvas = new Canvas(-100, -100)
      , image = new CropCanvas()

    image.onerror = function (error) {
      return done(error)
    }

    image.onload = function (canvas) {
      assert(canvas.height > 0, 'Is not a possitive number')
      assert(canvas.width > 0, 'Is not a possitive number')
    }

    image.crop(imageFixture, new Image(), canvas)

    done()
  })

  // adjust thresholds for slow tests in CropCanvas as we are doing multiple here
  this.slow(this._slow * dataProvider.length)

  it('should crop and crop an image to various sizes', function (done) {
    async.each(dataProvider, function(item, callback) {
      var originalImage = new Image()
        , canvas = new Canvas(item[0], item[1])
        , image = new CropCanvas()

      image.onerror = function (error) {
        return callback(error)
      }

      image.crop(imageFixture, new Image(), canvas, item[2])

      originalImage.onload = function () {
        var img = new Image()

        img.onerror = function (error) {
          return callback(error)
        }

        img.onload = function () {
          if (!item[0]) {
            assert.strictEqual(img.width, originalImage.width, JSON.stringify(item)
              + ' value ' + img.width + ' does not match expected originalImage width of '
              + originalImage.width)
          } else {
            assert.strictEqual(img.width, Math.abs(item[0]), JSON.stringify(item)
              + ' value ' + img.width + ' does not match expected new width of '
              + Math.abs(item[0]))
          }

          if (!item[1]) {
            assert.strictEqual(img.height, originalImage.height, JSON.stringify(item)
              + ' value ' + img.height + ' does not match expected originalImage height of '
              + originalImage.width)
          } else {
            assert.strictEqual(img.height, Math.abs(item[1]), JSON.stringify(item)
              + ' value ' + img.height + ' does not match expected new width of '
              + Math.abs(item[1]))
          }
          return callback()
        }

        img.src = canvas.toBuffer()
      }

      originalImage.onerror = function (error) {
        return callback(error)
      }

      originalImage.src = imageFixture
    }, done)
  })
})