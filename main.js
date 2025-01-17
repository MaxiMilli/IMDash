//const URL = "862341-7.web1.fh-htwchur.ch/api/get.php?mode=1&id=1";
//const apiURL = "http://862341-7.web1.fh-htwchur.ch/api";

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});

Vue.directive('select', {
    inserted: function (el) {
        el.select()
    }
});

Vue.use(Snotify);
Vue.use(VueCodeMirror);
window.CodeMirror = VueCodeMirror.CodeMirror

let layout = window.VueResponsiveGridLayout.VueResponsiveGridLayout;
let item = window.VueResponsiveGridLayout.VueGridItem;
let componentMixins = window.VueResponsiveGridLayout.GridItemComponentsMixins;

Vue.component('vue-responsive-grid-layout', layout);
Vue.component('vue-grid-item', item);
Vue.component('star-rating', VueStarRating.default)

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
        refreshPage: false
    },
    mounted: function () {
        this.getDataPoint('user', 'active', 1).then(function (response) {
            var optString = "";
            Object(response.data).forEach(user => {
                if (user.ID == 2) {
                    optString += "<option value='" + user.ID + "' selected>" + user.name + " (" + user.ID + ")</option>";
                } else {
                    optString += "<option value='" + user.ID + "'>" + user.name + " (" + user.ID + ")</option>";

                }
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
                if (response.data == "{ 'message':'no data' }") {
                    // neues Dashboard anlegen
                    this.insertDataPoint({
                        mode: 4,
                        userID: this.userID,
                        startup: 1
                    }).then(function (response) {
                        this.dashboardID = Number(response.dashboardID);
                        this.$router.push('/' + this.dashboardID);
                        this.userDataLoaded = true;
                    })
                } else {
                    Object(response.data).forEach(user => {
                        console.log(user);
                        if (user.startup == '1') {
                            this.dashboardID = user.dashboardID;
                            this.$router.push('/' + this.dashboardID);
                        }
                    });
                    this.userDataLoaded = true;
                }
            }.bind(this));
        },
        '$route' (old, fresh) {
            if (this.$router.currentRoute.name == 'home') {
                console.log(old.params.id);
                console.log(fresh.params.id);
                var that = this;
                this.userDataLoaded = false;
                Vue.nextTick(function (){
                    console.log("re-render");
                    that.userDataLoaded = true;
                })
                this.dashboardID = this.$route.params.id;
            }
        }
    }
});
