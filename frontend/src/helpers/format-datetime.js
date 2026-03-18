import moment from "moment-timezone";

const formatDate = {
  formatDateTime(datetime) {
    return moment
      .tz(datetime, "Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY - HH:mm:ss");
  },

  formatDateBirth(datetime) {
    return moment.tz(datetime, "Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  },

  formatTime(time) {
    return moment.tz(time, "Asia/Ho_Chi_Minh").format("HH:mm");
  },

  toSqlDateTime(date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
  },
};

export default formatDate;
