
//const URL = "862341-7.web1.fh-htwchur.ch/api/get.php?mode=1&id=1";
//const apiURL = "http://862341-7.web1.fh-htwchur.ch/api";

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});

Vue.use(Snotify);
let layout = window.VueResponsiveGridLayout.VueResponsiveGridLayout;
let item = window.VueResponsiveGridLayout.VueGridItem;
let componentMixins = window.VueResponsiveGridLayout.GridItemComponentsMixins;

Vue.component('vue-responsive-grid-layout', layout);
Vue.component('vue-grid-item', item);

var app = new Vue({
    router,
    el: '#app',
    mixins: [
        mixinAPI,
        componentMixins
    ],
    data: {
        message: 'Hello Vue!',
        viewModal: false,
        viewModalData: {},
        modalID: 5,
        dashboardID: 0,
        userID: 0,
        userDataLoaded: false,
    },
    mounted: function () {
        this.getDataPoint('user', 'active', 1).then(function (response) {
            var optString = "";
            Object(response.data).forEach(user => {
                optString += "<option value='" + user.ID + "'>" + user.name + " (" + user.ID +  ")</option>";
            });
            var that = this;
            $.sweetModal({
                title: 'User wählen',
                content: '<select id="userSelection">' + optString + '</select>',
                blocking: true,
                buttons: {
                    accept: {
                        label: 'Auswählen',
                        classes: '',
                        action: function () {
                            that.setUser(Number($('#userSelection').find(":selected")[0].value));
                        }
                    },
                }
            });
        }.bind(this));
    },
    methods: {
        setUser: function (id) {
            this.userID = id;
        },
    },
    watch: {
        userID: function (old, neww) {
            this.getDataPoint('userDashboard', 'userID', this.userID, false).then(function (response) {
                Object(response.data).forEach(user => {
                    if (user.startup == 1) {
                        this.dashboardID = user.dashboardID;
                    }
                });
            }.bind(this));
        },
        dashboardID: function (old, neww) {
            this.userDataLoaded = true;
        }
    }
});

