var mixinAPI = {
  created: function () {

  },
  methods: {
    getAPIURL: function () {
      return "http://862341-7.web1.fh-htwchur.ch/api";
    },
    // this.getDataPoint('table', 'col', 'val', true).then(function (response) { ... });
    getDataPoint: function (table, col, val, isString) {
      //console.log (table, col, val, isString);
      return new Promise((resolve) => {
        if (isString) {
          axios.get(this.getAPIURL() + '/get.php?mode=99&table=' + table + '&col=' + col + '&val=' + val + '&isstr=TRUE')
          .then(function(response) {
            //console.log(response);
              resolve(response);
          })
        } else {
          axios.get(this.getAPIURL() + '/get.php?mode=99&table=' + table + '&col=' + col + '&val=' + val + '&isstr=FALSE')
          .then(function(response) {
              //console.log(response);
              resolve(response);
          })
        }
      });
    },
    // this.updateDataPoint({table: 'dashboard', cell: 'name', val: this.dashboardName, whereCell: 'ID', whereVal: this.$root.dashboardID, mode: 99});
    updateDataPoint: function (paramObject) {
      const params = new URLSearchParams();
      for (var key in paramObject){
        params.append(key, paramObject[key]);
      }
      axios.post(this.getAPIURL() + '/update.php', params)
      .catch(function (error) {
          console.log("ERROR UPDATE Object:");
          console.log(paramObject);
      });
    },

    insertDataPoint: function (paramObject) {
      return new Promise((resolve) => {
        const params = new URLSearchParams();
        for (var key in paramObject){
          params.append(key, paramObject[key]);
        }
        axios.post(this.getAPIURL() + '/add.php', params)
        .then(function (response) {
          resolve(response);
        }).catch(function (error) {
          console.log("ERROR INSERT Object:");
          console.log(paramObject);
        });
      });
    }
  }
};
