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
      let arrCate = []
      let Giving = []
      let Using = []
      for (const data of result) {
        let time = new Date(data.time)
        arrCate.push(time.getTime())
        if (data.value[0]?.event === "ISSUE") {
          Giving.push(data.value[0].points)
          if (data.value[1]?.event === "REDEEM") {
            Using.push(data.value[1].points)
          } else {
            Using.push(0)
          }
        } else {
          Giving.push(0)
          Using.push(data.value[0].points)
        }
      }

      res.status(200).send({ success: true, data: result, arrCate, Giving, Using });
    } catch (err) {
      res.status(200).send({ success: false, err: err.message });
    }
  }
}

module.exports = new vuiCoinsController();
