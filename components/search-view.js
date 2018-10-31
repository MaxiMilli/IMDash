Vue.component('search-view', {
    data: function () {
        return {
            searchTerm: ''
        }
    },
    mounted: function () {
        this.searchTerm = this.$route.params.searchterm;
    },
    methods: {
        toggleMenu: function () {
        },
    },
    watch: {
        '$route': function () {
            this.searchTerm = this.$route.params.searchterm;
        }
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title-site">IMDash</span>
                    <span class="title-name">Suche</span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <notification-button></notification-button>                    
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    Suchbegriff: {{ searchTerm }}             
                </div>
            </div>
        </div>
    </div>
    
    `
});