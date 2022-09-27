const vuiCoins = require("../models/vuiCoins");
const userPoints = require("../models/userPoints");
var mongoose = require("mongoose");
const MAX_INSTANCE = 10;

const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const db = mongoose.connection;

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

  addDataFix = async (req, res) => {
    console.log("api call");
    const vuiCoinsInstance1 = new vuiCoins({
      vuiIncrease: 10113,
      vuiDecrease: 1001212,
      timestamp: new Date("2022-09-25T03:40:22.065+00:00"),
      metadata: {
        name: "vuiPoints",
      },
      minutes: {
        vuiIncrease: 10113,
        vuiDecrease: 1001212,
      },
    });
    const vuiCoinsInstance2 = new vuiCoins({
      vuiIncrease: 112120,
      vuiDecrease: 10012121,
      timestamp: new Date("2022-09-26T03:40:22.065+00:00"),
      metadata: {
        name: "vuiPoints",
      },
      minutes: {
        vuiIncrease: 112120,
        vuiDecrease: 10012121,
      },
    });
    const vuiCoinsInstance3 = new vuiCoins({
      vuiIncrease: 10,
      vuiDecrease: 100,
      timestamp: new Date("2022-09-27T03:40:22.065+00:00"),
      metadata: {
        name: "vuiPoints",
      },
      minutes: {
        vuiIncrease: 10,
        vuiDecrease: 100,
      },
    });

    try {
      await vuiCoinsInstance1.save();
      await vuiCoinsInstance2.save();
      await vuiCoinsInstance3.save();
      res.status(200).send({ success: true });
    } catch (e) {
      res.status(204).send({ success: false });
    }
    // .then((data) => {
    //   res.status(200).send({ success: true, data: data });
    // })
    // .catch((err) => {
    //   res.status(204).send({ success: false, err: err.message });
    // });
  };

  query = async (req, res) => {
    db.collection("system.buckets.vuicoins")
      .findOne()
      .then((data) => {
        // console.log("data", JSON.stringify(data));
        res.status(200).send({ success: true, data: data });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(204).send({ success: false });
      });
  };

  queryTest = async (req, res) => {
    // userPoints
    //   .find()
    //   .then((data) => {
    //     console.log("data", data);
    //     res.status(200).send({ success: true, data: data });
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //     res.status(200).send({ success: false });
    //   });
    db.user_point
      .find()
      .then((data) => {
        // console.log("data", JSON.stringify(data));
        res.status(200).send({ success: true, data: data });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(204).send({ success: false });
      });
    // };
  };
}

module.exports = new vuiCoinsController();