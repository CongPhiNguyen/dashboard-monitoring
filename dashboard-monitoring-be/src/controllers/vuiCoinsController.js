const vuiCoins = require("../models/vuiCoins");

const MAX_INSTANCE = 10;

const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class vuiCoinsController {
  init(req, res) {
    const vuiCoinsInstance = new vuiCoins({
      name: "vuiCoinsTracking",
      timestamp: new Date(),
      metadata: {},
      hours: {
        giving: 100,
        spending: 1000,
      },
    });
    // console.log("vuiCoinsInstance", vuiCoinsInstance);
    vuiCoinsInstance
      .save()
      .then((data) => {
        res.status(200).send({ run: true, data: data });
      })
      .catch((err) => {
        res.status(204).send({ run: true, err: err.message });
      });
  }
  test(req, res) {
    console.log("api call");

    // res.status(200).send({ run: true, data: data });
  }
  addData(req, res) {
    const insertValue = {
      vuiGiving: randomIntFromRange(10, 100),
      vuiSpending: randomIntFromRange(10, 100),
    };
    console.log("api call");

    const findVuiCoinsData = (createNewData, addToCurrentData) => {
      vuiCoins
        .find({
          $expr: { $lte: [{ $size: "$hours" }, MAX_INSTANCE] },
        })
        .then((data) => {
          console.log("data", data);
          if (data === null || data.length === 0) {
            createNewData();
          } else {
            console.log(data[0]._id.toString());
            addToCurrentData(data[0]._id.toString());
          }
        })
        .catch((err) => {
          console.log("err", err);
          res.status(204).send({ run: true, err: err.message });
        });
    };

    const createNewData = () => {
      const vuiCoinsInstance = new vuiCoins({
        name: "vuiCoinsTracking",
        timestamp: new Date(),
        metadata: {},
        hours: insertValue,
      });
      // console.log("vuiCoinsInstance", vuiCoinsInstance);
      vuiCoinsInstance
        .save()
        .then((data) => {
          res.status(200).send({ run: true, data: data });
        })
        .catch((err) => {
          res.status(204).send({ run: true, err: err.message });
        });
    };

    const addToCurrentData = (id) => {
      // console.log(id);
      vuiCoins
        .findByIdAndUpdate(id, {
          $push: { hours: insertValue },
        })
        .then((data) => {
          res.status(200).send({ run: true, data: data });
        })
        .catch((err) => {
          res.status(204).send({ run: true, err: err.message });
        });
    };

    findVuiCoinsData(
      () => {
        createNewData();
      },
      (id) => {
        addToCurrentData(id);
      }
    );
  }
}

module.exports = new vuiCoinsController();
