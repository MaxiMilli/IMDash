var mixinAPI = {
  created: function () {

  },
  methods: {
    getAPIURL: function () {
      return "http://862341-7.web1.fh-htwchur.ch/api";
    },
    getDataPoint: function (table, col, val) {
      return new Promise((resolve) => {
        axios.get(this.getAPIURL() + '/get.php?mode=99&table=' + table + '&col=' + col + '&val=' + val)
        .then(function(response) {
            resolve(response);
        })
      });
    },
    updateDataPoint: function (paramObject) {
      const params = new URLSearchParams();
      paramObject.forEach((param, id) => {
        params.append(id, param);
      });
      axios.post(this.getAPIURL() + '/update.php', params)
      .catch(function (error) {
          console.log("ERROR UPDATE Object:");
          console.log(paramObject);
      });
    }
  }
};
