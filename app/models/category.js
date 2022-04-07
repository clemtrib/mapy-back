module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      desc: String,
      slug: String,
      color: String,
    },
    { timestamps: true }
  );
  const Category = mongoose.model("category", schema);
  return Category;
};
