Vue.component('exercise-overview', {
    data: function () {
        return {
            count: 0,
            categorys: [],
            renderCategorys: false,
            notifications: [],
            exercises: []
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.$root.viewModal = false;

        this.getDataPoint('exerciseCategory', 'active', '1', false).then(function (response) {
            response.data.forEach((val, keyval) => {
                this.categorys.push(val);
            });
        }.bind(this));

        this.getDataPoint('exercise', 'featured', '1', false).then(function (response) {
            response.data.forEach((val, keyval) => {
                this.exercises.push(val);
            });
        }.bind(this));
    },
    methods: {
        getCategoryColor: function (categoryID) {
            var colo = "";
            this.categorys.forEach((cat, key) => {
                if (cat.ID === categoryID) {
                    colo =  this.categorys[key].color;
                }
            });

            return colo;
        },
    },
    computed: {
        getFeaturedExercises: function () {  
            return this.exercises;
        }
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title">IMDash</span>
                    <span class="title-name">Übungen</span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <notification-button></notification-button>                    
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="tile-exercise-title">Empfohlen</div>
            </div>

            <div class="row">
                <div v-for="exercise in getFeaturedExercises" class="tile-exercise-featured tile-border--black">
                    <div class="tile-excercise-marker" :style="{ 'background-color': getCategoryColor(exercise.category)}">
                        <i class="material-icons float-right">arrow_forward</i>
                    </div>
                    <div class=" tile-exercise-name">
                        <p>{{ exercise.name }}</p>
                    </div>
                    <div class=" tile-excercise-semester">
                        <p>Sem {{ exercise.grade }}</p>
                    </div>
                    <div class=" tile-excercise-level">
                        <p>Level {{ exercise.level }}</p>
                    </div>
                    <button class="btn tile-exercise-button">
                        <p>Übung lösen</p>
                    </button>
                </div>
            </div>

            <div class="row tile-exercise-panel-row">
                <div class="tile tile20 tile-border--black tile--spacing">
                    <div class="panel tile-border">
                        <div class="panel-head">
                            Lernfortschritt
                        </div>
                        <div class="panel-body">
                            <div class="tile-exercise-learn-progress">30%</div>
                        </div>
                    </div>
                </div>
                <div class="tile tile80 tile-border--black tile--spacing">
                    <div class="panel tile-border">
                        <div class="panel-head">
                            Deine Auszeichnungen
                        </div>
                        <div class="panel-body">
                            <div class="tile-exercise-title">Dein Level</div>
                            <div class="tile tile--spacing tile-border--black" style="display:inline; height: 50px; padding:10px; background-color:#5deae3">
                                Auszeichnung 1
                            </div>
                            <br><br>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="tile-exercise-title">Filtern</div>
            </div>

            <div class="row">
                <div v-for="cat in categorys" class="col-1 topic" :style="{ 'background-color': cat.color}">
                    <p>{{cat.name}}</p>
                </div>
            </div>

            <div class="row">
                <div class="tile-exercise-title">Übungen</div>
            </div>

            <div class="row">
                <exercise-pagination v-if="exercises" :listData="exercises" :size="10" :categoryList="categorys"></exercise-pagination>
            </div>
        </div>
    </div>    
    `
});