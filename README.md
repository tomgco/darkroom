darkroom
========

An image manipulation service.


Authentication between services and client will be achived by using Oauth. This will allow each request to be tied to a specific user account allowing per client granularity.

# Installation
## Mac OS X 10.8
    Install X11 from here: http://xquartz.macosforge.org/
    brew install cairo
    export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/opt/X11/lib/pkgconfig
    npm install

http://darkroom.io

# API

## POST /resize

Images will be resized, omission of the width or height parameter will auto resize based on the aspect ratio of the source image.

`src` - URL of image to manipulate.

`sizes` - An array of sizes to return, dimensions cannot be larger than the source image.

### Body

    { "src": "http://tomg.co/image.png"
    , "sizes":
      [ { w: 200
        , h: 400
        }
      , [100, 200]
      , [50] // keeps aspect ratio
      ]
    }

### Response

    { "200x400": "http://darkroom.io/200x400_image.png"
    , "100x200": "http://darkroom.io/100x200_image.png"
    , "50": "http://darkroom.io/50_image.png"
    }

# POST /optimise
or
# POST /optimize

This will preform an optimisation on image to the specified level, where 7 is the most aggressive, but increases reponse time.

`src` - URL of image to manipulate.

`level` - Optimisation level (0-7), default of 2.

### Request

    { "src": "http://tomg.co/image.png"
    , "level": 2
    }

### Response

    { "image": "http://darkroom.io/opt/2/100x200_image.png"
    }

# POST /crop

This will preform a manual crop on image using the speicfied coordinates, for a width and height.

`src` - URL of image to manipulate.

`sizes` - An array of sizes to return, dimensions cannot be larger than the source image.

`sizes.crops` - An object containing the coordinates of the crop to be made. Coorinates are relitive to the original image.

### Request

    { "src": "http://tomg.co/image.png"
    , "sizes":
      [ { w: 200
        , h: 400
        , crops:
          { x1: 10
          , x2: 100
          , y1: 100
          , y2: 100
          }
        }
      , [100, 200] // auto cropped when resized
      ]
    }

### Response

    { "200x400": "http://darkroom.io/200x400_image.png"
    , "100x200": "http://darkroom.io/100x200_image.png"
    }

