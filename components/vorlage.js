Vue.component('dashboard-view', {
    data: function () {
        return {
            count: 0
        }
    },
    methods: {
        toggleMenu: function () {
        },
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title-site">IMDash</span>
                    <span class="title-name">Übungen</span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <notification-button></notification-button>                    
                </div>
            </div>
        </div>
    </div>
    
    `
});