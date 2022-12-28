export const TemplateData = {
  filterLabels: {
    PriceRange: {
      title: "PriceRange",
      handle: "Price Range",
      values: [1000, 50000],
      min: 100,
      max: 50000,
      fromVal: 100,
      toVal: 50000,
    },
    SizeRange: {
      title: "SizeRange",
      handle: "Carat",
      values: [0.1, 20.0],
      min: 0.1,
      max: 20.0,
      fromVal: 0.1,
      toVal: 20.0,
    },
    Cut: {
      title: "Cut",
      handle: "Cut",
      values: ["Fair", "Good", "VeryGood", "Excellent", "Ideal"],
      labels: ["Fair", "Good", "Very Good", "Excellent", "Ideal"],
      min: 0,
      max: 5,
      fromVal: 0,
      toVal: 5,
    },
    Color: {
      title: "Color",
      handle: "Color",
      values: ["J", "I", "H", "G", "F", "E", "D"],
      labels: ["J", "I", "H", "G", "F", "E", "D"],
      min: 0,
      max: 7,
      fromVal: 0,
      toVal: 7,
    },
    Clarity: {
      title: "Clarity",
      handle: "Clarity",
      values: [
        "I3",
        "I2",
        "I1",
        "SI3",
        "SI2",
        "SI1",
        "VS2",
        "VS1",
        "VVS2",
        "VVS1",
        "IF",
      ],
      labels: [
        "I3",
        "I2",
        "I1",
        "SI3",
        "SI2",
        "SI1",
        "VS2",
        "VS1",
        "VVS2",
        "VVS1",
        "IF",
      ],
      min: 0,
      max: 11,
      fromVal: 0,
      toVal: 11,
    },
    Polish: {
      title: "Polish",
      handle: "Polish",
      values: ["Poor", "Fair", "Good", "VeryGood", "Excellent", "Ideal"],
      labels: ["Poor", "Fair", "Good", "Very Good", "Excellent", "Ideal"],
      min: 0,
      max: 6,
      fromVal: 0,
      toVal: 6,
    },
    Symmetry: {
      title: "Symmetry",
      handle: "Symmetry",
      values: ["Minute", "Fair", "Good", "VeryGood", "Excellent", "Ideal"],
      labels: ["Minute", "Fair", "Good", "Very Good", "Excellent", "Ideal"],
      min: 0,
      max: 6,
      fromVal: 0,
      toVal: 6,
    },
    Fluorescence: {
      title: "Fluorescence",
      handle: "Fluorescence",
      values: ["VeryStrong", "Strong", "Medium", "Faint", "None"],
      labels: ["Very Strong", "Strong", "Medium", "Faint", "None"],
      min: 0,
      max: 5,
      fromVal: 0,
      toVal: 5,
    },
    LengthToWidthRatio: {
      title: "LengthToWidthRatio",
      handle: "Length/Width Ratio",
      values: [0.1, 3.0],
      min: 0.1,
      max: 3.0,
      fromVal: 0.1,
      toVal: 3.0,
    },
    DepthPercent: {
      title: "DepthPercent",
      handle: "Depth %",
      values: [0, 100],
      min: 0,
      max: 100,
      fromVal: 0,
      toVal: 100,
    },
    TablePercent: {
      title: "TablePercent",
      handle: "Table %",
      values: [0, 100],
      min: 0,
      max: 100,
      fromVal: 0,
      toVal: 100,
    },
  },
  Shape: {
    title: "Shape",
    handle: "Shape",
    values: [
      "Round",
      "Square",
      "Oval",
      "Marquise",
      "Emerald",
      "Heart",
      "Pear",
      "Trillion",
      "Radiant",
      "Cushion",
      "Asscher",
    ],
  },
  intFilters: [
    "PriceRange",
    "SizeRange",
    "LengthToWidthRatio",
    "TablePercent",
    "DepthPercent",
  ],
};
