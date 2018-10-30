Vue.component('main-menu', {
    data: function () {
        return {
            active: false,
            userDashboards: []
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
        }
    },
    mounted: function () {
        this.getDataPoint('userDashboard', 'userID', this.$root.userID, false).then(function (response) {
            //if (response.data == "{ 'message':'no data' }") {
                // neues Dashboard anlegen
               // this.insertDataPoint({mode: 4, userID: this.userID}).then(function (response) {
               //     this.dashboardID = Number(response.dashboardID);
               // })
            //} else {
                console.log(response.data); 
                this.userDashboards = response.data;
            //}
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
        </div>
        <div class="page-menu">
            <center><span class="title" style="padding-left: 0px;">IMDash</span></center><br><br>
            <div class="page-menu-title">
                Dashboards
                <button class="page-menu-title-icon"><i class="material-icons">add</i></button>
            </div>
            
            <div class="page-menu-list-container">
                <a class="page-menu-list-item" href="">
                    Start
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