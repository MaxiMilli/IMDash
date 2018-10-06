
//const URL = "862341-7.web1.fh-htwchur.ch/api/get.php?mode=1&id=1";
//const apiURL = "http://862341-7.web1.fh-htwchur.ch/api";


Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});
var app = new Vue({
    router,
    el: '#app',
    data: {
        message: 'Hello Vue!',
        viewModal: false,
        viewModalData: {},
        modalID: 5,
        dashboardID: 1,
    },
    methods: {
    }
});