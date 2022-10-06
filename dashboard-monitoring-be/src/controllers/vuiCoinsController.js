var mongoose = require("mongoose")
const db = mongoose.connection
const schedule = require("node-schedule")
var rule = new schedule.RecurrenceRule()

rule.minute = new schedule.Range(0, 59, 5)


const job = schedule.scheduleJob("0 * * * * *", async () => {
  console.log("Update chart by minutes!")
  const currentTime = new Date(new Date().getTime() - 7 * 60 * 60 * 1000)
  let result = await db
    .collection("user_point")
    .aggregate([
      {
        $project: {
          date: {
            $dateToParts: { date: "$createdAt" }
          },
          value: 1,
          event: "$data.event"
        }
      },
      {
        $match: {
          "date.year": currentTime.getFullYear(),
          "date.month": currentTime.getMonth() + 1,
          "date.day": currentTime.getDate(),
          "date.hour": currentTime.getHours(),
          "date.minute": currentTime.getMinutes() - 1
        }
      },
      {
        $group: {
          _id: {
            $dateFromParts: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              hour: "$date.hour",
              minute: "$date.minute"
            }
          },
          value: {
            $push: {
              event: "$event",
              value: "$value"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ])
    .toArray()
  const sumOfArray = (arr) => {
    let resultSum = 0
    for (const arrVal of arr) {
      resultSum += arrVal
    }
    return resultSum
  }

  const vuiGiving = result.map((val) =>
    sumOfArray(
      val.value.map((value) => {
        if (value.event === "ISSUE" || value.event == "REFUND")
          return value.value
        else return 0
      })
    )
  )

  const vuiSpending = result.map((val) =>
    sumOfArray(
      val.value.map((value) => {
        if (value.event === "REDEEM") return value.value
        else return 0
      })
    )
  )
  // let a = new Date();
  const data = {
    result: result,
    vuiGiving: vuiGiving[0] || 0,
    vuiSpending: vuiSpending[0] || 0
  }
  global._io.emit("getData", { ...data })
})

const makeDayOfWeek = () => {
  let currentDate = new Date()
  // currentDate = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000)
  const res = []
  for (let i = 6; i >= 0; i--) {
    res.push(new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000))
  }
  return res
}

class vuiCoinsController {
  getAllDataVui = async (req, res) => {
    try {
      let { time } = req.query
      time = parseInt(time)
      if (!time) time = 8
      let currentDate = new Date()
      let passDate = new Date() - time * 60 * 60 * 1000
      currentDate = new Date(new Date(currentDate).toISOString())
      passDate = new Date(new Date(passDate).toISOString())
      console.log(currentDate)
      console.log(passDate)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" }
              },
              value: 1,
              event: "$data.event",
              createdAt: 1
            }
          },
          //
          {
            $match: {
              createdAt: {
                $gte: passDate,
                $lt: currentDate
              }
            }
          },
          //
          {
            $group: {
              _id: {
                timeTempt: {
                  year: "$date.year",
                  month: "$date.month",
                  day: "$date.day",
                  hour: "$date.hour",
                  second: "$date.second",
                  minute: "$date.minute"
                },
                event: "$event"
              },
              sum: { $sum: "$value" }
            }
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
                  minute: "$_id.timeTempt.minute"
                }
              },
              value: "$sum",
              event: "$_id.event"
            }
          },
          {
            $group: {
              _id: {
                time: "$time"
              },
              value: {
                $push: {
                  event: "$event",
                  points: "$value"
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              time: "$_id.time",
              value: "$value"
            }
          },
          {
            $sort: { time: 1 }
          }
        ])
        .toArray()
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

      res
        .status(200)
        .send({ success: true, data: result, arrCate, Giving, Using })
    } catch (err) {
      console.log(err)
      res.status(200).send({ success: false, err: err.message })
    }
  }

  getDataByWeek = async (req, res) => {
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt", timezone: `Asia/Ho_Chi_Minh` }
            },
            value: 1,
            event: "$data.event"
          }
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              event: "$event"
            },
            value: { $sum: "$value" }
          }
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: 0,
                minute: 0
              }
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value"
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()
    const dayOfWeek = makeDayOfWeek()
    // const dateString =
    let vuiGiving = []
    let vuiSpending = []
    for (let i = 0; i < dayOfWeek.length; i++) {
      let isFind = false
      for (let j = 0; j < result.length; j++) {
        const resultDate = new Date(result[j]._id)
        if (
          dayOfWeek[i].getDate() === resultDate.getDate() &&
          dayOfWeek[i].getMonth() === resultDate.getMonth() &&
          dayOfWeek[i].getFullYear() === resultDate.getFullYear()
        ) {
          isFind = true
          let vuiGivingItem = 0,
            vuiSpendingItem = 0
          for (let k = 0; k < result[j].value.length; k++) {
            if (result[j].value[k].event !== "REDEEM") {
              vuiGivingItem += result[j].value[k].value
            } else vuiSpendingItem += result[j].value[k].value
          }
          vuiGiving.push(vuiGivingItem)
          vuiSpending.push(vuiSpendingItem)
          break
        }
      }
      if (!isFind) {
        vuiGiving.push(0)
        vuiSpending.push(0)
      }
    }

    res.status(200).send({
      success: true,
      result: result,
      dateString: dayOfWeek,
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending
    })
  }

  getDataByDay = async (req, res) => {
    console.log(req.query.day)
    let [day, month, year] = req.query.day.split("/")
    day = parseInt(day)
    month = parseInt(month)
    year = parseInt(year)

    // const dateString = new Date(req.query.date)
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt", timezone: `Asia/Ho_Chi_Minh` }
            },
            value: 1,
            event: "$data.event"
          }
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              hour: "$date.hour",
              event: "$event"
            },
            value: { $sum: "$value" }
          }
        },
        {
          $match: {
            "_id.year": year,
            "_id.month": month,
            "_id.day": day
          }
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
              hour: "$_id.hour"
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value"
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()

    let vuiGiving = []
    let vuiSpending = []

    for (let i = 0; i < 24; i++) {
      let isFind = false
      for (let j = 0; j < result.length; j++) {
        if (result[j]._id.hour === i) {
          isFind = true
          let vuiGivingItem = 0
          let vuiSpendingItem = 0
          for (let k = 0; k < result[j].value.length; k++) {
            if (result[j].value[k].event !== "REDEEM") {
              vuiGivingItem += result[j].value[k].value
            } else vuiSpendingItem += result[j].value[k].value
          }
          console.log(result[j].value)
          vuiGiving.push(vuiGivingItem)
          vuiSpending.push(vuiSpendingItem)
          break
        }
      }
      if (!isFind) {
        // console.log("duc", i)
        vuiGiving.push(0)
        vuiSpending.push(0)
      }
    }

    res.status(200).send({
      success: true,
      result: result,
      fix: true,
      hourArray: [...Array(24).keys()],
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending
    })
  }

  getDataByHour = async (req, res) => {
    // console.log(req.query.day);
    let [day, month, year] = req.query.day.split("/")
    let hour = parseInt(req.query.hour)
    day = parseInt(day)
    month = parseInt(month)
    year = parseInt(year)

    // const dateString = new Date(req.query.date)
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt", timezone: `Asia/Ho_Chi_Minh` }
            },
            value: 1,
            event: "$data.event"
          }
        },
        {
          $group: {
            _id: {
              year: "$date.year",
              month: "$date.month",
              day: "$date.day",
              hour: "$date.hour",
              minute: "$date.minute",
              event: "$event"
            },
            value: { $sum: "$value" }
          }
        },
        {
          $match: {
            "_id.year": year,
            "_id.month": month,
            "_id.day": day,
            "_id.hour": hour
          }
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
              hour: "$_id.hour",
              minute: "$_id.minute"
            },
            value: {
              $push: {
                event: "$_id.event",
                value: "$value"
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()
    let vuiGiving = []
    let vuiSpending = []
    for (let i = 0; i < 60; i++) {
      let isFind = false
      for (let j = 0; j < result.length; j++) {
        if (result[j]._id.minute === i) {
          isFind = true
          let vuiGivingItem = 0
          let vuiSpendingItem = 0
          for (let k = 0; k < result[j].value.length; k++) {
            if (result[j].value[k].event !== "REDEEM") {
              vuiGivingItem += result[j].value[k].value
            } else vuiSpendingItem += result[j].value[k].value
          }
          vuiGiving.push(vuiGivingItem)
          vuiSpending.push(vuiSpendingItem)
        }
      }
      if (!isFind) {
        vuiGiving.push(0)
        vuiSpending.push(0)
      }
    }

    res.status(200).send({
      success: true,
      result: result,
      vuiGiving: vuiGiving,
      vuiSpending: vuiSpending,
      vuiGivingLength: vuiGiving.length,
      vuiSpendingLength: vuiSpending.length
    })
  }

  getDataByMinute = async (req, res) => {
    // const currentTime = new Date(
    //   new Date("2022-09-27T07:54:00.0+00:00").getTime() - 7 * 60 * 60 * 1000
    // )
    const currentTime = new Date(new Date().getTime() - 7 * 60 * 60 * 1000)
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt" }
            },
            value: 1,
            event: "$data.event"
          }
        },
        {
          $match: {
            "date.year": currentTime.getFullYear(),
            "date.month": currentTime.getMonth() + 1,
            "date.day": currentTime.getDate(),
            "date.hour": currentTime.getHours(),
            "date.minute": currentTime.getMinutes() - 1
          }
        },
        {
          $group: {
            _id: {
              $dateFromParts: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                minute: "$date.minute"
              }
            },
            value: {
              $push: {
                event: "$event",
                value: "$value"
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()
    const sumOfArray = (arr) => {
      let resultSum = 0
      for (const arrVal of arr) {
        resultSum += arrVal
      }
      return resultSum
    }

    const vuiGiving = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value
          else return 0
        })
      )
    )

    const vuiSpending = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value
          else return 0
        })
      )
    )
    res.status(200).send({
      success: true,
      result: result,
      vuiGiving: vuiGiving[0] || 0,
      vuiSpending: vuiSpending[0] || 0
    })
  }

  getDataBySecond = async (req, res) => {
    const currentTime = new Date(
      new Date().getTime() - 7 * 60 * 60 * 1000 - 60 * 1000
    )
    let result = await db
      .collection("user_point")
      .aggregate([
        {
          $project: {
            date: {
              $dateToParts: { date: "$createdAt" }
            },
            value: 1,
            event: "$data.event"
          }
        },
        {
          $match: {
            "date.year": currentTime.getFullYear(),
            "date.month": currentTime.getMonth() + 1,
            "date.day": currentTime.getDate(),
            "date.hour": currentTime.getHours(),
            "date.minute": currentTime.getMinutes(),
            "date.second": currentTime.getSeconds()
          }
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
                second: "$date.second"
              }
            },
            value: {
              $push: {
                event: "$event",
                value: "$value"
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()
    const sumOfArray = (arr) => {
      let resultSum = 0
      for (const arrVal of arr) {
        resultSum += arrVal
      }
      return resultSum
    }

    const vuiGiving = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "ISSUE" || value.event == "REFUND")
            return value.value
          else return 0
        })
      )
    )

    const vuiSpending = result.map((val) =>
      sumOfArray(
        val.value.map((value) => {
          if (value.event === "REDEEM") return value.value
          else return 0
        })
      )
    )
    res.status(200).send({
      success: true,
      result: result,
      vuiGiving: vuiGiving[0] || 0,
      vuiSpending: vuiSpending[0] || 0
    })
  }

  getConcreteValue = async (req, res) => {
    // console.log("req.query", req.query.type);
    let result = await db
      .collection("user_point")
      .aggregate([{ $group: { _id: `$data.${req.query.type}` } }])
      .toArray()
    res.status(200).send({ success: true, result: result })
  }

  // getConcreteData Using:
  // query = {
  //   options: "all" || "week" || "day" || "hour" || "minute",
  //   dataType: "brandCode" || "storeCode" || "service",
  //   value: <value form getConcreteValue>,
  //   day: "dd/mm/yy",
  //   hour: Number
  // };
  getConcreteData = async (req, res) => {
    // Options
    // all, week, day, hour, minute
    const { options, dataType, value } = req.query

    console.log(options, dataType, value)

    const currentDate = new Date()

    const getAllData = async () => {
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" }
              },
              value: 1,
              event: "$data.event",
              dataType: `$data.${dataType}`,
              createdAt: 1
            }
          },
          {
            $match: {
              dataType: value,
              createdAt: {
                $gte: currentDate.getTime() - 8 * 60 * 60 * 1000,
                $lt: currentDate.getTime()
              }
            }
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
                  minute: "$date.minute"
                },
                event: "$event"
              },
              sum: { $sum: "$value" }
            }
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
                  minute: "$_id.timeTempt.minute"
                }
              },
              value: "$sum",
              event: "$_id.event"
            }
          },
          {
            $group: {
              _id: {
                time: "$time"
              },
              value: {
                $push: {
                  event: "$event",
                  points: "$value"
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              time: "$_id.time",
              value: "$value"
            }
          },
          {
            $sort: { time: 1 }
          }
        ])
        .toArray()
      let arrCate = []
      let vuiGiving = []
      let vuiSpending = []
      for (const data of result) {
        let time = new Date(data.time)
        arrCate.push(time.getTime())
        if (data.value[0]?.event === "ISSUE") {
          vuiGiving.push(data.value[0].points)
          if (data.value[1]?.event === "REDEEM") {
            vuiSpending.push(data.value[1].points)
          } else {
            vuiSpending.push(0)
          }
        } else {
          vuiGiving.push(0)
          vuiSpending.push(data.value[0].points)
        }
      }
      res.status(200).send({ success: true, arrCate, vuiGiving, vuiSpending })
    }
    const getWeekData = async () => {
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event",
              dataType: `$data.${dataType}`
            }
          },
          {
            $match: {
              dataType: value
            }
          },
          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $group: {
              _id: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                  hour: 0,
                  minute: 0
                }
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      const dayOfWeek = makeDayOfWeek()
      // const dateString =
      let vuiGiving = []
      let vuiSpending = []
      for (let i = 0; i < dayOfWeek.length; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          const resultDate = new Date(result[j]._id)
          if (
            dayOfWeek[i].getDate() === resultDate.getDate() &&
            dayOfWeek[i].getMonth() === resultDate.getMonth() &&
            dayOfWeek[i].getFullYear() === resultDate.getFullYear()
          ) {
            isFind = true
            let vuiGivingItem = 0,
              vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
            break
          }
        }
        if (!isFind) {
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        dateString: dayOfWeek,
        vuiGiving: vuiGiving,
        vuiSpending: vuiSpending
      })
    }
    const getDayData = async () => {
      console.log(req.query.day)
      let [day, month, year] = req.query.day.split("/")
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)

      // const dateString = new Date(req.query.date)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event",
              dataType: `$data.${dataType}`
            }
          },
          {
            $match: {
              dataType: value
            }
          },
          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $match: {
              "_id.year": year,
              "_id.month": month,
              "_id.day": day
            }
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour"
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()

      let vuiGiving = []
      let vuiSpending = []

      for (let i = 0; i < 24; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          if (result[j]._id.hour === i) {
            isFind = true
            let vuiGivingItem = 0
            let vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            console.log(result[j].value)
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
            break
          }
        }
        if (!isFind) {
          // console.log("duc", i)
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        hourArray: [...Array(24).keys()],
        vuiGiving: vuiGiving,
        vuiSpending: vuiSpending
      })
    }
    const getHourData = async () => {
      let [day, month, year] = req.query.day.split("/")
      let hour = parseInt(req.query.hour)
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)

      // const dateString = new Date(req.query.date)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event",
              dataType: `$data.${dataType}`
            }
          },
          {
            $match: {
              dataType: value
            }
          },
          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                minute: "$date.minute",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $match: {
              "_id.year": year,
              "_id.month": month,
              "_id.day": day,
              "_id.hour": hour
            }
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour",
                minute: "$_id.minute"
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      let vuiGiving = []
      let vuiSpending = []
      for (let i = 0; i < 60; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          if (result[j]._id.minute === i) {
            isFind = true
            let vuiGivingItem = 0
            let vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
          }
        }
        if (!isFind) {
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        vuiGiving: vuiGiving,
        vuiGivingLength: vuiGiving.length,
        vuiSpending: vuiSpending,
        vuiSpendingLength: vuiSpending.length
      })
    }
    const getMinutesData = async () => {
      const currentTime = new Date(new Date().getTime() - 7 * 60 * 60 * 1000)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" }
              },
              value: 1,
              data: `$data`,
              dataType: `$data.${dataType}`
            }
          },
          {
            $match: {
              dataType: value
            }
          },
          {
            $match: {
              "date.year": currentTime.getFullYear(),
              "date.month": currentTime.getMonth() + 1,
              "date.day": currentTime.getDate(),
              "date.hour": currentTime.getHours(),
              "date.minute": currentTime.getMinutes() - 1
            }
          },
          {
            $project: {
              value: 1,
              data: 1
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      const sumOfArray = (arr) => {
        let resultSum = 0
        for (const arrVal of arr) {
          resultSum += arrVal
        }
        return resultSum
      }

      const vuiGiving = result.map((val) =>
        sumOfArray(
          val.value.map((value) => {
            if (value.event === "ISSUE" || value.event == "REFUND")
              return value.value
            else return 0
          })
        )
      )

      const vuiSpending = result.map((val) =>
        sumOfArray(
          val.value.map((value) => {
            if (value.event === "REDEEM") return value.value
            else return 0
          })
        )
      )
      res.status(200).send({
        success: true,
        // result: result,
        vuiGiving: vuiGiving[0] || 0,
        vuiSpending: vuiSpending[0] || 0
      })
    }
    if (options === "all") {
      getAllData()
    } else if (options === "week") {
      getWeekData()
    } else if (options === "day") {
      getDayData()
    } else if (options === "hour") {
      getHourData()
    } else if (options === "minute") {
      getMinutesData()
    }
  }

  // getConcreteData Using:
  // query = {
  //   options: "all" || "week" || "day" || "hour" || "minute",
  //   brandCode: "all", <brandCodeName>,
  //   storeCode: "all", <storeCode>,
  //   service: "all", <serviceName>
  //   day: "dd/mm/yy",
  //   hour: Number
  // };
  getConcreteData2 = async (req, res) => {
    // Options
    // all, week, day, hour, minute
    const { options, dataType, value } = req.query

    console.log(options, dataType, value)

    const currentDate = new Date()

    const createMatchObject = (query) => {
      const { brandCode, storeCode, service } = query
      let matchObject = {}
      if (brandCode) {
        matchObject.brandCode = brandCode
      }
      if (storeCode) {
        matchObject.storeCode = storeCode
      }
      if (service) {
        matchObject.service = service
      }
    }

    const getAllData = async () => {
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObject(req.query),
              createdAt: {
                $gte: currentDate.getTime() - 8 * 60 * 60 * 1000,
                $lt: currentDate.getTime()
              }
            }
          },
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" }
              },
              value: 1,
              event: "$data.event",
              dataType: `$data.${dataType}`,
              createdAt: 1
            }
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
                  minute: "$date.minute"
                },
                event: "$event"
              },
              sum: { $sum: "$value" }
            }
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
                  minute: "$_id.timeTempt.minute"
                }
              },
              value: "$sum",
              event: "$_id.event"
            }
          },
          {
            $group: {
              _id: {
                time: "$time"
              },
              value: {
                $push: {
                  event: "$event",
                  points: "$value"
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              time: "$_id.time",
              value: "$value"
            }
          },
          {
            $sort: { time: 1 }
          }
        ])
        .toArray()
      let arrCate = []
      let vuiGiving = []
      let vuiSpending = []
      for (const data of result) {
        let time = new Date(data.time)
        arrCate.push(time.getTime())
        if (data.value[0]?.event === "ISSUE") {
          vuiGiving.push(data.value[0].points)
          if (data.value[1]?.event === "REDEEM") {
            vuiSpending.push(data.value[1].points)
          } else {
            vuiSpending.push(0)
          }
        } else {
          vuiGiving.push(0)
          vuiSpending.push(data.value[0].points)
        }
      }
      res.status(200).send({ success: true, arrCate, vuiGiving, vuiSpending })
    }
    const getWeekData = async () => {
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObject(req.query)
            }
          },
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event"
            }
          },

          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $group: {
              _id: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                  hour: 0,
                  minute: 0
                }
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      const dayOfWeek = makeDayOfWeek()
      // const dateString =
      let vuiGiving = []
      let vuiSpending = []
      for (let i = 0; i < dayOfWeek.length; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          const resultDate = new Date(result[j]._id)
          if (
            dayOfWeek[i].getDate() === resultDate.getDate() &&
            dayOfWeek[i].getMonth() === resultDate.getMonth() &&
            dayOfWeek[i].getFullYear() === resultDate.getFullYear()
          ) {
            isFind = true
            let vuiGivingItem = 0,
              vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
            break
          }
        }
        if (!isFind) {
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        dateString: dayOfWeek,
        vuiGiving: vuiGiving,
        vuiSpending: vuiSpending
      })
    }
    const getDayData = async () => {
      console.log(req.query.day)
      let [day, month, year] = req.query.day.split("/")
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)

      // const dateString = new Date(req.query.date)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObject(req.query)
            }
          },
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event"
            }
          },

          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $match: {
              "_id.year": year,
              "_id.month": month,
              "_id.day": day
            }
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour"
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()

      let vuiGiving = []
      let vuiSpending = []

      for (let i = 0; i < 24; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          if (result[j]._id.hour === i) {
            isFind = true
            let vuiGivingItem = 0
            let vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            console.log(result[j].value)
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
            break
          }
        }
        if (!isFind) {
          // console.log("duc", i)
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        hourArray: [...Array(24).keys()],
        vuiGiving: vuiGiving,
        vuiSpending: vuiSpending
      })
    }
    const getHourData = async () => {
      let [day, month, year] = req.query.day.split("/")
      let hour = parseInt(req.query.hour)
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)

      // const dateString = new Date(req.query.date)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObject(req.query)
            }
          },
          {
            $project: {
              date: {
                $dateToParts: {
                  date: "$createdAt",
                  timezone: `Asia/Ho_Chi_Minh`
                }
              },
              value: 1,
              event: "$data.event"
            }
          },

          {
            $group: {
              _id: {
                year: "$date.year",
                month: "$date.month",
                day: "$date.day",
                hour: "$date.hour",
                minute: "$date.minute",
                event: "$event"
              },
              value: { $sum: "$value" }
            }
          },
          {
            $match: {
              "_id.year": year,
              "_id.month": month,
              "_id.day": day,
              "_id.hour": hour
            }
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                hour: "$_id.hour",
                minute: "$_id.minute"
              },
              value: {
                $push: {
                  event: "$_id.event",
                  value: "$value"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      let vuiGiving = []
      let vuiSpending = []
      for (let i = 0; i < 60; i++) {
        let isFind = false
        for (let j = 0; j < result.length; j++) {
          if (result[j]._id.minute === i) {
            isFind = true
            let vuiGivingItem = 0
            let vuiSpendingItem = 0
            for (let k = 0; k < result[j].value.length; k++) {
              if (result[j].value[k].event !== "REDEEM") {
                vuiGivingItem += result[j].value[k].value
              } else vuiSpendingItem += result[j].value[k].value
            }
            vuiGiving.push(vuiGivingItem)
            vuiSpending.push(vuiSpendingItem)
          }
        }
        if (!isFind) {
          vuiGiving.push(0)
          vuiSpending.push(0)
        }
      }

      res.status(200).send({
        success: true,
        result: result,
        vuiGiving: vuiGiving,
        vuiGivingLength: vuiGiving.length,
        vuiSpending: vuiSpending,
        vuiSpendingLength: vuiSpending.length
      })
    }
    const getMinutesData = async () => {
      const currentTime = new Date(new Date().getTime() - 7 * 60 * 60 * 1000)
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObject(req.query)
            }
          },
          {
            $project: {
              date: {
                $dateToParts: { date: "$createdAt" }
              },
              value: 1,
              data: `$data`
            }
          },

          {
            $match: {
              "date.year": currentTime.getFullYear(),
              "date.month": currentTime.getMonth() + 1,
              "date.day": currentTime.getDate(),
              "date.hour": currentTime.getHours(),
              "date.minute": currentTime.getMinutes() - 1
            }
          },
          {
            $project: {
              value: 1,
              data: 1
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray()
      const sumOfArray = (arr) => {
        let resultSum = 0
        for (const arrVal of arr) {
          resultSum += arrVal
        }
        return resultSum
      }

      const vuiGiving = result.map((val) =>
        sumOfArray(
          val.value.map((value) => {
            if (value.event === "ISSUE" || value.event == "REFUND")
              return value.value
            else return 0
          })
        )
      )

      const vuiSpending = result.map((val) =>
        sumOfArray(
          val.value.map((value) => {
            if (value.event === "REDEEM") return value.value
            else return 0
          })
        )
      )
      res.status(200).send({
        success: true,
        // result: result,
        vuiGiving: vuiGiving[0] || 0,
        vuiSpending: vuiSpending[0] || 0
      })
    }
    if (options === "all") {
      getAllData()
    } else if (options === "week") {
      getWeekData()
    } else if (options === "day") {
      getDayData()
    } else if (options === "hour") {
      getHourData()
    } else if (options === "minute") {
      getMinutesData()
    }
  }

  getTransactionDataInMinute = async (req, res) => {
    try {
      let { hour, minute, options } = req.query
      let [day, month, year] = req.query.day.split("/")
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)
      hour = parseInt(hour)
      minute = parseInt(minute)

      const createMatchObject = (options) => {
        if (options === "minute") {
          // console.log("run");
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour,
              "date.minute": minute
            }
          }
        } else if (options === "hour") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour
            }
          }
        } else if (options === "day") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day
            }
          }
        } else if (options === "all") {
          return {}
        }
      }
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          },
          {
            $project: {
              date: {
                $dateToParts: { date: "$date" }
              },
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          },
          createMatchObject(options),
          {
            $project: {
              date: "$date",
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          }
        ])
        .toArray()
      res.status(200).send({ success: true, result: result })
    } catch (err) {
      console.log("err", err)
      res.status(204).send({ success: false })
    }
  }

  getConcreteTransactionData = async (req, res) => {
    try {
      let { hour, minute, options } = req.query
      let [day, month, year] = req.query.day.split("/")
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)
      hour = parseInt(hour)
      minute = parseInt(minute)
      const { dataType, value } = req.query

      const createMatchObject = (options) => {
        if (options === "minute") {
          // console.log("run");
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour,
              "date.minute": minute
            }
          }
        } else if (options === "hour") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour
            }
          }
        } else if (options === "day") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day
            }
          }
        } else if (options === "all") {
          return {}
        }
      }
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $project: {
              date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
              value: 1,
              event: "$data.event",
              data: `$data`,
              dataType: `$data.${dataType}`
            }
          },
          {
            $match: {
              dataType: value
            }
          },
          {
            $project: {
              date: {
                $dateToParts: { date: "$date" }
              },
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          },
          createMatchObject(options),
          {
            $project: {
              date: "$date",
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          }
        ])
        .toArray()
      res.status(200).send({ success: true, result: result })
    } catch (err) {
      console.log("err", err)
      res.status(204).send({ success: false })
    }
  }

  getConcreteTransactionData2 = async (req, res) => {
    try {
      let { hour, minute, options } = req.query
      let [day, month, year] = req.query.day.split("/")
      day = parseInt(day)
      month = parseInt(month)
      year = parseInt(year)
      hour = parseInt(hour)
      minute = parseInt(minute)

      const createMatchObjectDataType = (query) => {
        const { brandCode, storeCode, service } = query
        let matchObject = {}
        if (brandCode && brandCode !== "false") {
          matchObject.brandCode = brandCode
        }
        if (storeCode) {
          matchObject.storeCode = storeCode
        }
        if (service) {
          matchObject.service = service
        }
      }

      const createMatchObject = (options) => {
        if (options === "minute") {
          // console.log("run");
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour,
              "date.minute": minute
            }
          }
        } else if (options === "hour") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day,
              "date.hour": hour
            }
          }
        } else if (options === "day") {
          return {
            $match: {
              "date.year": year,
              "date.month": month,
              "date.day": day
            }
          }
        } else if (options === "all") {
          return {}
        }
      }
      let result = await db
        .collection("user_point")
        .aggregate([
          {
            $match: {
              ...createMatchObjectDataType(req.query)
            }
          },
          {
            $project: {
              date: { $add: ["$createdAt", 7 * 60 * 60 * 1000] },
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          },
          {
            $project: {
              date: {
                $dateToParts: { date: "$date" }
              },
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          },
          createMatchObject(options),
          {
            $project: {
              date: "$date",
              value: 1,
              event: "$data.event",
              data: `$data`
            }
          }
        ])
        .toArray()
      res.status(200).send({ success: true, result: result })
    } catch (err) {
      console.log("err", err)
      res.status(204).send({ success: false })
    }
  }
}

module.exports = new vuiCoinsController()
