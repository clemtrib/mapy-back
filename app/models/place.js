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
      user: Number,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Place = mongoose.model("place", schema);
  return Place;
};
