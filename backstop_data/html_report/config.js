report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../bitmaps_reference/triolla_visual_regression_Homepage_-_Desktop_-_EN_0_body_0_desktop.png",
        "test": "../bitmaps_test/20260406-213523/triolla_visual_regression_Homepage_-_Desktop_-_EN_0_body_0_desktop.png",
        "selector": "body",
        "fileName": "triolla_visual_regression_Homepage_-_Desktop_-_EN_0_body_0_desktop.png",
        "label": "Homepage - Desktop - EN",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:3000/",
        "referenceUrl": "http://localhost:8888/index.html",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "rawMisMatchPercentage": 90.05277777777778,
          "misMatchPercentage": "90.05",
          "analysisTime": 43
        },
        "diffImage": "../bitmaps_test/20260406-213523/failed_diff_triolla_visual_regression_Homepage_-_Desktop_-_EN_0_body_0_desktop.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "../bitmaps_reference/triolla_visual_regression_Homepage_-_Desktop_-_HE_0_body_0_desktop.png",
        "test": "../bitmaps_test/20260406-213523/triolla_visual_regression_Homepage_-_Desktop_-_HE_0_body_0_desktop.png",
        "selector": "body",
        "fileName": "triolla_visual_regression_Homepage_-_Desktop_-_HE_0_body_0_desktop.png",
        "label": "Homepage - Desktop - HE",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "http://localhost:3000/he",
        "referenceUrl": "http://localhost:8889/index.html",
        "expect": 0,
        "viewportLabel": "desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "rawMisMatchPercentage": 35.926953125,
          "misMatchPercentage": "35.93",
          "analysisTime": 40
        },
        "diffImage": "../bitmaps_test/20260406-213523/failed_diff_triolla_visual_regression_Homepage_-_Desktop_-_HE_0_body_0_desktop.png"
      },
      "status": "fail"
    }
  ],
  "id": "triolla_visual_regression"
});