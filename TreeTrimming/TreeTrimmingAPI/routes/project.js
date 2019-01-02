const db = require("seriate");
const when = require("when");

const config = require("../config");

const sqlInsertProject =
  "INSERT INTO [Project]([routeId],[county], [route],[notes],[type], [width], [effectiveLength], [effectiveAcres], [beginLocation], [beginMilepoint], [endLocation], [endMilepoint], [dateReviewed]) OUTPUT inserted.id, inserted.notes, inserted.effectiveAcres VALUES ( @routeId, @county,@route,@notes,@type,@width,@effectiveLength,@effectiveAcres,(SELECT geography::Point(@beginLat, @beginLong, 4326)),@beginMilepoint, (SELECT geography::Point(@endLat, @endLong, 4326)),@endMilepoint,@dateReviewed)";

const sqlSelectProjects =
  "SELECT [id],[Project].[routeId], [Project].[county], [Project].[route], [Project].[notes], [Project].[type], [Project].[width], [Project].[effectiveLength], [Project].[effectiveAcres], [Project].[beginLocation].Lat as beginLat, [Project].[beginLocation].Long as beginLong, [Project].[beginMilepoint], [Project].[endLocation].Lat as endLat, [Project].[endLocation].Long as endLong, [Project].[endMilepoint], [Project].[dateReviewed] FROM [Project] ORDER BY [Project].[routeId]";

  const sqlSelectProject =
  "SELECT [id], [Project].[routeId], [Project].[county], [Project].[route], [Project].[notes], [Project].[type], [Project].[width], [Project].[effectiveLength], [Project].[effectiveAcres], [Project].[beginLocation].Lat as beginLat, [Project].[beginLocation].Long as beginLong, [Project].[beginMilepoint], [Project].[endLocation].Lat as endLat, [Project].[endLocation].Long as endLong, [Project].[endMilepoint], [Project].[dateReviewed] FROM [Project] WHERE [Project].[id] = @id";

var conn = {
  host: config.db.server,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
};

db.addConnection(conn);

exports.insertProject = (req, res, next) => {
  db.execute(conn, {
    preparedSql: sqlInsertProject,
    params: {
      routeId: {
        type: db.VARCHAR(16),
        val: req.body.routeId
      },
      county: {
        type: db.VARCHAR(50),
        val: req.body.county
      },
      route: {
        type: db.VARCHAR(50),
        val: req.body.route
      },
      notes: {
        type: db.TEXT,
        val: req.body.notes
      },
      type: {
        type: db.VARCHAR(50),
        val: req.body.type
      },
      width: {
        type: db.INT,
        val: req.body.width
      },
      effectiveLength: {
        type: db.INT,
        val: req.body.effectiveLength
      },
      effectiveAcres: {
        type: db.DECIMAL(6, 3),
        val: req.body.effectiveAcres
      },
      beginLat: {
        type: db.FLOAT,
        val: req.body.beginLat
      },
      beginLong: {
        type: db.FLOAT,
        val: req.body.beginLong
      },
      beginMilepoint: {
        type: db.DECIMAL(6, 3),
        val: req.body.beginMilepoint
      },
      endLat: {
        type: db.FLOAT,
        val: req.body.endLat
      },
      endLong: {
        type: db.FLOAT,
        val: req.body.endLong
      },
      endMilepoint: {
        type: db.DECIMAL(6, 3),
        val: req.body.endMilepoint
      },
      dateReviewed: {
        type: db.DATE,
        val: req.body.dateReviewed
      }
    }
  }).then(
    data => {
      console.log("insertProject", data);
      res.json(data);
    },
    err => {
      console.log(err);
    }
  );
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

exports.selectProject = (req, res, next) => {
    db.execute(conn, {
        preparedSql: sqlSelectProject,
        params: {
            id: {
                type: db.INT,
                val: req.params.id
            }
        }
    }).then(
        data => {
            console.log("selectProject", data);
            res.json(data);
        },
        err => {
            console.log(err);
        }
    );
};
