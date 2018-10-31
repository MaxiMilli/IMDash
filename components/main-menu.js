Vue.component('main-menu', {
    data: function () {
        return {
            active: false,
            userDashboards: [],
            addDashboardLoading: false,
            searchOpen: false,
        }
    },
    mixins: [
        mixinAPI
    ],
    methods: {
        toggleMenu: function () {
            if ($('.page-menu').css('left') != '0px')
            {
                this.active = true;
                // Animation open Menu
                $('.page-menu').animate({
                    left: '0px'
                } , 500);
                $('#page-menu-open').addClass('is-active');
                var filterVal = 'blur(4px)';
                $('#content').css({
                    'filter':filterVal,
                    'webkitFilter':filterVal,
                    'mozFilter':filterVal,
                    'oFilter':filterVal,
                    'msFilter':filterVal,
                    'transition':'all 0.5s ease-out',
                    '-webkit-transition':'all 0.5s ease-out',
                    '-moz-transition':'all 0.5s ease-out',
                    '-o-transition':'all 0.5s ease-out'
                });
                $('.page-menu-overlay').addClass('page-menu-overlay--set');
            }
            else
            {
                this.closeMenu();
            }
        },
        closeMenu: function () {
            // Animation back
            $('.page-menu').animate({
                left: '-400px'
            } , 500);
            $('#page-menu-open').removeClass('is-active');
            var filterVal = 'blur(0px)';
            $('#content').css({
                'filter':filterVal,
                'webkitFilter':filterVal,
                'mozFilter':filterVal,
                'oFilter':filterVal,
                'msFilter':filterVal,
                'transition':'all 0.5s ease-out',
                '-webkit-transition':'all 0.5s ease-out',
                '-moz-transition':'all 0.5s ease-out',
                '-o-transition':'all 0.5s ease-out'
            });
            $('.page-menu-overlay').removeClass('page-menu-overlay--set');
        },
        addDashboard: function () {
            this.addDashboardLoading = true;
            var that = this;
            this.insertDataPoint({mode: 4, userID: this.userID, startup: 0}).then(function (response) {
                console.log(response);
                that.getDataPoint('dashboard', 'ID', response.data.dashboardID, false).then(function (response2) {
                    console.log(response2);
                    that.userDashboards.push(response2.data[0]);
                    that.addDashboardLoading = false;
                });
            });
        },
        toggleSearch: function () {

            if (this.searchOpen) {
                $('.search-circle').removeClass('circle-extendet');
                $('.search-form').hide();
                $('.search-icon').text('search');
                this.searchOpen = false;
            } else {
                $('.search-circle').addClass('circle-extendet');
                $('.search-form').show();
                $('.search-icon').text('arrow_back');
                this.searchOpen = true;
            }
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
        '$route' (to, from) {
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
            <div class="search-circle">
                <i class="material-icons search-icon" @click="toggleSearch">search</i>
                <input type="text" placeholder="Suche" class="search-form">
            </div>
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
                <a class="page-menu-list-item" href="">
                    {{ dash.name }}
                </a>
            </div>
            <hr class="page-menu-hr">
            <div class="page-menu-title">Üben</div>
            <div class="page-menu-list-container">
                <router-link to="/exercise" class="page-menu-list-item">
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