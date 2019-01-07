Vue.component('exercise-rating', {
    data: function () {
        return {
            exerciseRating: 0
        }
    },
    methods: {
        toggleMenu: function () {},
    },
    watch: {
        exerciseRating: function () {
            this.$snotify.success('Danke für die Bewertung!');
            this.$router.push('/exercises/overview');
        }
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
                <div class="col-12">
                    <div class="panel tile-border--gold">
                        <div class="tile-head">
                            Bewertung der Schwierigkeit
                        </div>
                        <div class="tile-body column">
                            <p>Wie schwierig war die Aufgabe? (1 = sehr einfach / 5 = sehr schwierig)</p>
                            <star-rating v-model="exerciseRating"></star-rating>
                            <br>
                            <br>
                            <br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    `
});
