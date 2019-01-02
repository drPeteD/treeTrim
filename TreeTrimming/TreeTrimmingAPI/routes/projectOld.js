const db = require("seriate");
const when = require("when");

const config = require("../config");

const sqlInsertPoint =
  "INSERT INTO [Points]([Location], [Milepoint]) OUTPUT inserted.PointID VALUES ((SELECT geography::Point(@Lat, @Long, 4326)), @Milepoint)";

const sqlInsertProject =
  "INSERT INTO [Projects]([ProjectName],[ProjectType],[RouteID],[PointStart],[PointEnd],[Length],[Width],[Area]) OUTPUT inserted.ProjectID, inserted.Area VALUES (@ProjectName, @ProjectType, @RouteID, @PointStart, @PointEnd, @Length, @Width, @Area)";

const sqlSelectProjects =
  "SELECT [Projects].[ProjectName], [Projects].[RouteID], [Projects].[Area], [StartPoint].[Location].Lat as Lat, [StartPoint].[Location].Long as Long, [ProjectTypes].[ProjectTypeName] FROM [Projects] INNER JOIN [Points] AS StartPoint ON [Projects].[PointStart] = [StartPoint].[PointID] INNER JOIN [ProjectTypes] ON [Projects].[ProjectType] = [ProjectTypes].[ProjectTypeID] ORDER BY [RouteID]";

const sqlSelectPoint =
  "SELECT [Location].Lat AS Lat, [Location].Long AS Long FROM [Points] WHERE [PointID] = @PointID";

const sqlSelectProjectDetail =
  "SELECT [Projects].[ProjectName], [Projects].[RouteID], [Projects].[Length], [Projects].[Width], [Projects].[Area], [ProjectTypes].[ProjectTypeName], [StartPoint].[Location].Lat as startLat, [StartPoint].[Location].Long as startLong, [EndPoint].[Location].Lat as endLat, [EndPoint].[Location].Long As endLong FROM [Projects] INNER JOIN [ProjectTypes] ON [Projects].[ProjectType] = [ProjectTypes].[ProjectTypeID] INNER JOIN [Points] AS StartPoint ON [Projects].[PointStart] = [StartPoint].[PointID] INNER JOIN [Points] AS EndPoint ON [Projects].[PointEnd] = EndPoint.[PointID] WHERE [ProjectID] = @ProjectID";

var conn = {
  host: config.db.server,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
};

db.addConnection(conn);

exports.insertProject = (req, res, next) => {
  db.getPlainContext()
    .step("insertStartPoint", {
      preparedSql: sqlInsertPoint,
      params: {
        Lat: {
          type: db.FLOAT,
          val: req.body.startLat
        },
        Long: {
          type: db.FLOAT,
          val: req.body.startLong
        },
        Milepoint: {
          type: db.DECIMAL(6, 3),
          val: req.body.startMilepoint
        }
      }
    })
    .step("insertEndPoint", {
      preparedSql: sqlInsertPoint,
      params: {
        Lat: {
          type: db.FLOAT,
          val: req.body.endLat
        },
        Long: {
          type: db.FLOAT,
          val: req.body.endLong
        },
        Milepoint: {
          type: db.DECIMAL(6, 3),
          val: req.body.endMilepoint
        }
      }
    })
    .step("insertProjectInfo", (execute, data) => {
      var startPoint = data.insertStartPoint[0].PointID;
      var endPoint = data.insertEndPoint[0].PointID;
      if (req.body.length == "") {
        if (req.body.startMilepoint < req.body.endMilepoint) {
          var projLength =
            (req.body.endMilepoint - req.body.startMilepoint) * 5280;
        } else {
          var projLength =
            (req.body.startMilepoint - req.body.endMilepoint) * 5280;
        }
      } else {
          var projLength = req.body.length;
      }
      console.log("projLength", projLength);
      var projArea = (((req.body.width * projLength) / 43560) * 0.125).toFixed(
        3
      );
      console.log("projArea", projArea);
      execute({
        preparedSql: sqlInsertProject,
        params: {
          ProjectName: {
            type: db.VARCHAR(50),
            val: req.body.projectName
          },
          ProjectType: {
            type: db.INT,
            val: req.body.projectType
          },
          RouteID: {
            type: db.VARCHAR(50),
            val: req.body.routeID
          },
          PointStart: {
            type: db.INT,
            val: startPoint // Change
          },
          PointEnd: {
            type: db.INT,
            val: endPoint // Change
          },
          Width: {
            type: db.INT,
            val: req.body.width
          },
          Length: {
            type: db.DECIMAL(10, 3),
            val: projLength
          },
          Area: {
            type: db.DECIMAL(6, 3),
            val: projArea
          }
        }
      });
    })
    .end(sets => {
      console.log("sets", sets);
      res.json(sets);
    })
    .error(err => {
      console.log(err);
    });
};

exports.selectProjects = (req, res, next) => {
  db.execute(conn, {
    preparedSql: sqlSelectProjects
  }).then(
    data => {
      console.log("selectProjects", data);
      res.json(data);
    },
    err => {
      console.log(err);
    }
  );
};

exports.selectPoint = (req, res, next) => {
  db.execute(conn, {
    preparedSql: sqlSelectPoint,
    params: {
      PointID: {
        type: db.INT,
        val: req.params.pointID
      }
    }
  }).then(
    data => {
      console.log("selectPoint", data);
      res.json(data);
    },
    err => {
      console.log(err);
    }
  );
};

exports.selectProjectDetail = (req, res, next) => {
  db.execute(conn, {
    preparedSql: sqlSelectProjectDetail,
    params: {
      ProjectID: {
        type: db.INT,
        val: req.params.projectID
      }
    }
  }).then(
    data => {
      console.log("projectDetail", data);
      res.json(data);
    },
    err => {
      console.log(err);
    }
  );
};
