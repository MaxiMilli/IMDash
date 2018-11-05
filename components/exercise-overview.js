Vue.component('exercise-overview', {
    data: function () {
        return {
            count: 0,
            categorys: [],
            renderCategorys: false,
            selectedCategorys: [],
            notifications: [],
            exercises: [],
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
        toggleCatSelection: function (id) {
            if (this.selectedCategorys.includes(id)) {
                // remove
                var index = this.selectedCategorys.indexOf(id);
                if (index > -1) {
                    this.selectedCategorys.splice(index, 1);
                }
            } else {
                //add
                this.selectedCategorys.push(id);
            }
        }
    },
    computed: {
        getFeaturedExercises: function () {
            var ret = [];
            this.exercises.forEach(function (exe) {
                if  (exe.featured == '1'){
                    ret.push(exe);
                }
            });
            return ret;
        },
        getSortedExercises: function () {
            var ret = [];
            var that = this;
            this.exercises.forEach(function (exe) {
                if (that.selectedCategorys.length !== 0) {
                    // Some Sort
                    if (that.selectedCategorys.includes(exe.category)) {
                        ret.push(exe);
                    }
                    console.log(exe.ID)
                } else {
                    ret.push(exe);
                }
            });
            return ret;
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
            <div class="row">
                <div class="tile-exercise-title">Empfohlen</div>
            </div>

            <div class="row">
                <div v-if="getFeaturedExercises.length !== 0" v-for="exercise in getFeaturedExercises" class="tile-exercise-featured tile-border--black">
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
                    <router-link :to="{ path: '/exercise/solve/' + exercise.ID}" class="btn tile-exercise-button">
                        <p>Übung lösen</p>
                    </router-link>
                </div>
                <div v-else class="tile-exercise-featured tile-border--black">
                    <div class="tile-excercise-marker" style="background-color: gray; color: white;">
                        <i class="material-icons float-right">cloud_download</i>
                    </div>
                    <div class=" tile-exercise-name">
                        <p>Load...</p>
                    </div>
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
                <button v-for="cat in categorys" @click="toggleCatSelection(cat.ID)" class="col-1 topic" :style="{ 'background-color': cat.color}">
                    <p>{{cat.name}}</p>
                </button>
            </div>

            <div class="row">
                <div class="tile-exercise-title">Übungen</div>
            </div>

            <div class="row">
                <exercise-pagination v-if="exercises" :listData="getSortedExercises" :size="10" :categoryList="categorys"></exercise-pagination>
            </div>
        </div>
    </div>    
    `
});