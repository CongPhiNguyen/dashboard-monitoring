var mongoose = require("mongoose");

const db = mongoose.connection;

class vuiCoinsController {
  getAllDataVui = async (req, res) => {
    try {
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" },
              },
              value: 1,
              event: "$data.event",
            },
          },
          {
            $group: {
              _id: {
                timeTempt: {
                  year: "$date.year",
                  month: "$date.month",
                  day: "$date.day",
                  hour: "$date.hour",
                  minute: "$date.second",
                },
                event: "$event",
              },
              sum: { $sum: "$value" },
            },
          },
          {
            $project: {
              _id: 0,
              time: {
                $dateFromParts: {
                  year: "$_id.timeTempt.year",
                  month: "$_id.timeTempt.month",
                  day: "$_id.timeTempt.day",
                  hour: "$_id.timeTempt.hour",
                  minute: "$_id.timeTempt.minute",
                },
              },
              value: "$sum",
              event: "$_id.event",
            },
          },
          {
            $group: {
              _id: {
                time: "$time",
              },
              value: {
                $push: {
                  event: "$event",
                  points: "$value",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              time: "$_id.time",
              value: "$value",
            },
          },
          {
            $sort: { time: 1 },
          },
        ])
        .toArray();
      let arrCate = [];
      let Giving = [];
      let Using = [];
      for (const data of result) {
        let time = new Date(data.time);
        arrCate.push(time.getTime());
        if (data.value[0]?.event === "ISSUE") {
          Giving.push(data.value[0].points);
          if (data.value[1]?.event === "REDEEM") {
            Using.push(data.value[1].points);
          } else {
            Using.push(0);
          }
        } else {
          Giving.push(0);
          Using.push(data.value[0].points);
        }
      }

      res
        .status(200)
        .send({ success: true, data: result, arrCate, Giving, Using });
    } catch (err) {
      res.status(200).send({ success: false, err: err.message });
    }
  };

  getDataByWeek = async (req, res) => {
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
            value: 1,
            event: "$data.event",
          },
        },
        {
          $project: {
            date: {
              $dateToParts: { date: "$date" },
            },
            value: 1,
            event: "$event",
          },
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              event: "$event",
            },
            value: { $sum: "$value" },
          },
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: 0,
                minute: 0,
              },
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    // Xử lý thêm default
    let currentDay = new Date();
    currentDay.setTime(
      currentDay.getTime() - (8 - result.length) * 24 * 60 * 60 * 1000
    );

    console.log(currentDay);
    for (let i = 6 - result.length; i >= 0; i--) {
      result.unshift({
        _id: new Date(currentDay.getTime() + i * 24 * 60 * 60 * 1000),
        value: [
          {
            event: "REDEEM",
            value: 0,
          },
          {
            event: "ISSUE",
            value: 0,
          },
        ],
      });
    }
    const sumOfArray = (arr) => {
      let resultSum = 0;
      for (const arrVal of arr) {
        resultSum += arrVal;
      }
      return resultSum;
    };
    const dateString = result.map((val) => val._id);
    const vuiGiving = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value;
          else return 0;
        })
      )
    );
    const vuiSpending = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value;
          else return 0;
        })
      )
    );

    res.status(200).send({
      success: true,
      dateString: dateString,
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending,
    });
  };

  getDataByDay = async (req, res) => {
    console.log(req.query.day);
    let [day, month, year] = req.query.day.split("/");
    day = parseInt(day);
    month = parseInt(month);
    year = parseInt(year);

    // const dateString = new Date(req.query.date)
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
            value: 1,
            event: "$data.event",
          },
        },
        {
          $project: {
            date: {
              $dateToParts: { date: "$date" },
            },
            value: 1,
            event: "$event",
          },
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              hour: "$date.hour",
              event: "$event",
            },
            value: { $sum: "$value" },
          },
        },
        {
          $match: {
            "_id.year": year,
            "_id.month": month,
            "_id.day": day,
          },
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour",
              },
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const hourArrayTempt = result.map((val) => {
      return new Date(
        new Date(val._id).getTime() - 7 * 60 * 60 * 1000
      ).getHours();
    });

    const sumOfArray = (arr) => {
      let resultSum = 0;
      for (const arrVal of arr) {
        resultSum += arrVal;
      }
      return resultSum;
    };

    const vuiGivingTemp = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value;
          else return 0;
        })
      )
    );

    const vuiSpendingTemp = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value;
          else return 0;
        })
      )
    );

    let currentIndex = 0;

    let vuiSpending = [];
    let vuiGiving = [];
    for (let i = 0; i < 23; i++) {
      if (hourArrayTempt.includes(i)) {
        vuiGiving.push(vuiGivingTemp[currentIndex]);
        vuiSpending.push(vuiSpendingTemp[currentIndex]);
        currentIndex++;
      } else {
        vuiGiving.push(0);
        vuiSpending.push(0);
      }
    }

    res.status(200).send({
      success: true,
      result: result,
      hourArray: [...Array(24).keys()],
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending,
    });
  };

  getDataByHour = async (req, res) => {
    // console.log(req.query.day);
    let [day, month, year] = req.query.day.split("/");
    let hour = parseInt(req.query.hour);
    day = parseInt(day);
    month = parseInt(month);
    year = parseInt(year);

    // const dateString = new Date(req.query.date)
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
            value: 1,
            event: "$data.event",
          },
        },
        {
          $project: {
            date: {
              $dateToParts: { date: "$date" },
            },
            value: 1,
            event: "$event",
          },
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              hour: "$date.hour",
              minute: "$date.minute",
              event: "$event",
            },
            value: { $sum: "$value" },
          },
        },
        {
          $match: {
            "_id.year": year,
            "_id.month": month,
            "_id.day": day,
            "_id.hour": hour,
          },
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour",
                minute: "$_id.minute",
              },
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const minuteArrayTempt = result.map((val) => {
      return new Date(
        new Date(val._id).getTime() - 7 * 60 * 60 * 1000
      ).getMinutes();
    });

    const sumOfArray = (arr) => {
      let resultSum = 0;
      for (const arrVal of arr) {
        resultSum += arrVal;
      }
      return resultSum;
    };

    const vuiGivingTemp = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value;
          else return 0;
        })
      )
    );

    const vuiSpendingTemp = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value;
          else return 0;
        })
      )
    );

    let currentIndex = 0;

    let vuiSpending = [];
    let vuiGiving = [];
    for (let i = 0; i < 60; i++) {
      if (minuteArrayTempt.includes(i)) {
        vuiGiving.push(vuiGivingTemp[currentIndex]);
        vuiSpending.push(vuiSpendingTemp[currentIndex]);
        currentIndex++;
      } else {
        vuiGiving.push(0);
        vuiSpending.push(0);
      }
    }

    res.status(200).send({
      success: true,
      // result: result,
      // minuteArrayTempt: minuteArrayTempt,
      // vuiGivingTemp,
      // vuiSpendingTemp,
      // hourArray: [...Array(24).keys()],
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending,
    });
  };

  getDataByMinute = async (req, res) => {
    const currentTime = new Date(
      new Date("2022-09-27T07:54:00.0+00:00").getTime() - 7 * 60 * 60 * 1000
    );
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt" },
            },
            value: 1,
            event: "$data.event",
          },
        },
        {
          $match: {
            "date.year": currentTime.getFullYear(),
            "date.month": currentTime.getMonth() + 1,
            "date.day": currentTime.getDate(),
            "date.hour": currentTime.getHours(),
            "date.minute": currentTime.getMinutes() - 1,
          },
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                minute: "$date.minute",
              },
            },
            value: {
              $push: {
                event: "$event",
                value: "$value",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    const sumOfArray = (arr) => {
      let resultSum = 0;
      for (const arrVal of arr) {
        resultSum += arrVal;
      }
      return resultSum;
    };

    const vuiGiving = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value;
          else return 0;
        })
      )
    );

    const vuiSpending = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value;
          else return 0;
        })
      )
    );
    res.status(200).send({
      success: true,
      result: result,
      vuiGiving: vuiGiving[0] || 0,
      vuiSpending: vuiSpending[0] || 0,
    });
  };

  getConcreteValue = async (req, res) => {
    // console.log("req.query", req.query.type);
    let result = await db
      .collection("user_point")
      .aggregate([{ $group: { _id: `$data.${req.query.type}` } }])
      .toArray();
    res.status(200).send({ success: true, result: result });
  };

  getConcreteData = async (req, res) => {
    console.log("req.query.options", req.query.options);
    // Options
    // all, week, day, hour, minute
    const { dataType, value } = req.query;

    const matchObject = () => {
      if (req.query.options === "all") {
        return {};
      }
    };
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt" },
            },
            value: 1,
            event: "$data.event",
            dataType: `$data.${dataType}`,
          },
        },
        matchObject,
        {
          $match: {
            dataType: value,
          },
        },
        {
          $group: {
            _id: {
              timeTempt: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                second: "$date.second",
                minute: "$date.minute",
              },
              event: "$event",
            },
            sum: { $sum: "$value" },
          },
        },

        {
          $project: {
            _id: 0,
            time: {
              $dateFromParts: {
                year: "$_id.timeTempt.year",
                month: "$_id.timeTempt.month",
                day: "$_id.timeTempt.day",
                hour: "$_id.timeTempt.hour",
                second: "$_id.timeTempt.second",
                minute: "$_id.timeTempt.minute",
              },
            },
            value: "$sum",
            event: "$_id.event",
          },
        },
        {
          $group: {
            _id: {
              time: "$time",
            },
            value: {
              $push: {
                event: "$event",
                points: "$value",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            time: "$_id.time",
            value: "$value",
          },
        },
        {
          $sort: { time: 1 },
        },
      ])
      .toArray();
    let arrCate = [];
    let vuiGiving = [];
    let vuiSpending = [];
    for (const data of result) {
      let time = new Date(data.time);
      arrCate.push(time.getTime());
      if (data.value[0]?.event === "ISSUE") {
        vuiGiving.push(data.value[0].points);
        if (data.value[1]?.event === "REDEEM") {
          vuiSpending.push(data.value[1].points);
        } else {
          vuiSpending.push(0);
        }
      } else {
        vuiGiving.push(0);
        vuiSpending.push(data.value[0].points);
      }
    }

    // res
    //   .status(200)
    //   .send({ success: true, data: result, arrCate, Giving, Using });
    res.status(200).send({ success: true, arrCate, vuiGiving, vuiSpending });
  };
}

module.exports = new vuiCoinsController();
