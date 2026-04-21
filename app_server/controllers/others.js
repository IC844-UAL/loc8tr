const about = (req, res) => {
  res.render("index", { title: "About | Mean Project" });
};

module.exports = {
  about,
};
