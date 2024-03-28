const sql = require("../config/vacCenterDB");

// constructor
const VacCenter = function (vacCenter) {
  this.id = vacCenter.id;
  this.name = vacCenter.name;
  this.tel = vacCenter.tel;
};

VacCenter.getAll = (result) => {
  sql.query("SELECT * FROM vacCenters;", (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }

    console.log("vacCenters : ", res);
    result(null, res);
  });
};

module.exports = VacCenter;
// mysql -h 192.0.0.1:3306 -u username -p
