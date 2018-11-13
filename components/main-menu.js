Vue.component('main-menu', {
    data: function () {
        return {
            active: false,
            userDashboards: [],
            addDashboardLoading: false,
            searchOpen: false,
            searchText: ''
        }
    },
    mixins: [
        mixinAPI
    ],
    methods: {
        toggleMenu: function () {
            this.searchOpen = false;
            if ($('.page-menu').css('left') != '0px') {
                this.active = true;
                // Animation open Menu
                $('.page-menu').animate({
                    left: '0px'
                }, 500);
                $('#page-menu-open').addClass('is-active');
                var filterVal = 'blur(4px)';
                $('#content').css({
                    'filter': filterVal,
                    'webkitFilter': filterVal,
                    'mozFilter': filterVal,
                    'oFilter': filterVal,
                    'msFilter': filterVal,
                    'transition': 'all 0.5s ease-out',
                    '-webkit-transition': 'all 0.5s ease-out',
                    '-moz-transition': 'all 0.5s ease-out',
                    '-o-transition': 'all 0.5s ease-out'
                });
                $('.page-menu-overlay').addClass('page-menu-overlay--set');
            } else {
                this.closeMenu();
            }
        },
        closeMenu: function () {
            // Animation back
            $('.page-menu').animate({
                left: '-400px'
            }, 500);
            $('#page-menu-open').removeClass('is-active');
            var filterVal = 'blur(0px)';
            $('#content').css({
                'filter': filterVal,
                'webkitFilter': filterVal,
                'mozFilter': filterVal,
                'oFilter': filterVal,
                'msFilter': filterVal,
                'transition': 'all 0.5s ease-out',
                '-webkit-transition': 'all 0.5s ease-out',
                '-moz-transition': 'all 0.5s ease-out',
                '-o-transition': 'all 0.5s ease-out'
            });
            $('.page-menu-overlay').removeClass('page-menu-overlay--set');
        },
        addDashboard: function () {
            this.addDashboardLoading = true;
            var that = this;
            this.insertDataPoint({
                mode: '4',
                userID: String(this.$root.userID),
                startup: '0'
            }).then(function (response) {
                that.getDataPoint('dashboard', 'ID', response.data.dashboardID, false).then(function (response2) {
                    that.userDashboards.push(response2.data[0]);
                    that.addDashboardLoading = false;
                });
            });
        },
        searchDash: function () {
            this.$router.push({
                path: '/search/' + this.searchText
            });
            this.searchOpen = false;
        },
        switchDashboard: function () {
            this.$root.userDataLoaded = false;

        }
    },
    mounted: function () {
        var that = this;
        this.getDataPoint('userDashboard', 'userID', this.$root.userID, false).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                that.getDataPoint('dashboard', 'ID', response.data[i].dashboardID, false).then(function (response2) {
                    console.log(response2);
                    that.userDashboards.push(response2.data[0]);
                });
            }
        }.bind(this));
    },
    watch: {
        '$route'(to, from) {
            if (this.active) {
                this.toggleMenu();
            }
        },
    },
    template: `
    <div class="menu">
        <div class="page-menu-button">
            <button v-on:click="toggleMenu" class="hamburger hamburger--spin" id="page-menu-open" type="button">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>


            <!-- SUCHFELD (ausgeblendet)
            <div class="search-circle" :class="{ 'circle-extendet': searchOpen }">
                <i v-if="searchOpen" class="material-icons search-icon" @click="searchOpen = !searchOpen">arrow_back</i>
                <i v-else class="material-icons search-icon" @click="searchOpen = !searchOpen">search</i>
                <input v-if="searchOpen" type="text" placeholder="Suche" class="search-form" @keyup.enter="searchDash" v-model="searchText" v-focus v-select>
            </div>
            -->


        </div>
        <div class="page-menu">
            <center><span class="title-site" style="padding-left: 0px;">IMDash</span></center><br><br>
            <div class="page-menu-title">
                Dashboards
                <button @click="addDashboard" class="page-menu-title-icon float-right"><i class="material-icons">add</i></button>
            </div>
            <div class="page-menu-list-container" v-if="addDashboardLoading">
                Lädt gerade...
            </div>
            <div v-else class="page-menu-list-container" v-for="dash in userDashboards">
                <router-link :to="{path: '/' + dash.ID}" class="page-menu-list-item">
                    {{ dash.name }}
                </router-link>
            </div>
            <hr class="page-menu-hr">
            <div class="page-menu-title">Üben</div>
            <div class="page-menu-list-container">
                <router-link :to="{path: '/exercises/overview'}" class="page-menu-list-item">
                    Alle Übungen
                </router-link>
            </div>
            <hr class="page-menu-hr">

            <div class="page-menu-list-container">
                <router-link to="/presentation/1" class="page-menu-list-item">
                    Presentation
                </router-link>
            </div>
        </div>
        <div class="page-menu-overlay" v-on:click="toggleMenu">
            &nbsp;
        </div>
    </div>`
})
