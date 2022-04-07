module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      desc: String,
      categories: Array,
      lat: mongoose.Decimal128,
      lon: mongoose.Decimal128,
      assets: Array,
      visits: Array,
      planified: Boolean,
      user: String,
    },
    { timestamps: true }
  );
  const Place = mongoose.model("place", schema);
  return Place;
};
