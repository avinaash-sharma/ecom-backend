const HOCPromise = require("../middleware/HOCPromise");

// instead of using HOCPromise we can directly use try/catch and also can apply async-await to it.
// here this HOCPromise acts like a big promise that willbe helpfull while using a db call or anything like that
exports.home = HOCPromise(async (req, res) => {
  // const dbConnection = await dbConnectStatus();
  res.status(200).json({
    success: true,
    greeting: "Hello, world! Hello, People!",
  });
});

exports.homeDummy = HOCPromise(async (req, res) => {
  // const dbConnection = await dbConnectStatus();

  res.status(200).json({
    success: true,
    greeting: "This is a dummy message from Dummy!",
  });
});
