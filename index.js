// inspired by http://webreflection.blogspot.com/2010/12/100-client-side-image-resizing.html
/* 

Use: 

var resizeImage = require('html5-canvas-image-resizer')
var resizer = resizeImage(this.document.createElement('canvas'))
resizer(imgsrc, width, height, imgtype, function (dataURL) {
  // do something with base64 image src
})

*/

module.exports = function (canvas) {

  return function (imgsrc, width, height, type, onresample) {
  console.log(width)
     var img, imgsrcstr = 'string' === typeof imgsrc
    if ( imgsrcstr ) {
      img = new Image
      img.src = imgsrc
      img.onload = onLoad
    }
    else { img = imgsrc }
    img.onerror = function () { throw ('not found: ' + this.src) }
    img._onresample = onresample
    img._width = width
    img._height = height
    img._type = type || 'png'
    if ( !imgsrcstr ) { onLoad.call(imgsrc) } // imgsrc has img's props
  }

  function onLoad() {
    var img = this

    img._width  == null && (img._width  = Math.round(img.width  * img._height / img.height))
    img._height == null && (img._height = Math.round(img.height * img._width  / img.width))
    canvas.width  = img._width
    canvas.height = img._height
    canvas.getContext('2d').drawImage(
      img,
      0, 0, // starting
      img.width, img.height, // image
      0, 0, // destination
      img._width, img._height // destination
    )
    // pass base64 encoded PNG to the callback
    img._onresample(canvas.toDataURL('image/' + img._type))
    delete img._onresample
    delete img._width
    delete img._height
    delete img._type
  }
}


