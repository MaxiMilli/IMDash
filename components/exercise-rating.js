Vue.component('exercise-rating', {
    data: function () {
        return {
            exerciseRating: 0
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
        <div class="container">
            <div class="row exercise-rating">
                <star-rating v-model="exerciseRating"></star-rating>
                <div class="col-12">
                    <div class="panel tile-border--black">
                        <div class="tile-head">
                            Rating
                        </div>
                        <div class="tile-body column">
                            <p>Bitte bewerte die Schwierigkeit der Übung. War die Übung schwierig?</p>
                            <star-rating v-model="exerciseRating"></star-rating>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    `
});