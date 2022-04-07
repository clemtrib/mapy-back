module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      firstname: String,
      lastname: String,
      email: String,
      password: String,
      isAdmin: Boolean,
    },
    { timestamps: true }
  );
  const User = mongoose.model("user", schema);
  return User;
};
