Vue.component('main-menu', {
    data: function () {
        return {
            count: 0
        }
    },
    methods: {
        toggleMenu: function () {
            if ($('.page-menu').css('left') != '0px')
            {
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
            <center><span class="title">IMDash</span></center><br><br>
            <div class="page-menu-title">Dashboards</div>
            <div class="page-menu-list-container">
                <a class="page-menu-list-item" href="">
                    Start
                </a>
            </div>
            <hr class="page-menu-hr">
            <div class="page-menu-title">Kapitel</div>
            <div class="page-menu-list-container">
                <a class="page-menu-list-item" href="/presentation/view/1">
                    Vorlesung
                </a>
            </div>
            <div class="page-menu-list-container">
                <a class="page-menu-list-item" href="/excercise/view/1#">
                    Übungen
                </a>
            </div>
            <hr class="page-menu-hr">
        </div>
        <div class="page-menu-overlay">
            &nbsp;
        </div>
    </div>`
})