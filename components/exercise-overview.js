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
                console.log(cat.ID, categoryID, key)
                if (cat.ID === categoryID) {
                    colo =  this.categorys[key].color;
                }
            });

            return colo;
        },
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title">IMDash</span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <button class="title-button float-right" v-tippy="{ html : '#notificationsPanel', reactive : true, interactive : true, placement : 'bottom', theme: 'light', trigger: 'click' }"><i class="material-icons">notifications</i></button>
                    <div id="notificationsPanel" x-placement="bottom">
                        <div class="share-notes-modal">
                            <h3> Notifications</h3>
                            <div v-for="noti in notifications" class="notification">
                                <router-link :to="noti.url">
                                    <h5>{{noti.title}}</h5>
                                    <p>{{noti.body}}</p>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="tile-exercise-title">Filtern</div>
            </div>

            <div class="row">
                <div v-for="cat in categorys" class="col-1 topic" :style="{ 'background-color': cat.color}">
                    <p>{{cat.name}}</p>
                </div>
            </div>

            <div class="row">
                <div class="tile-exercise-title">Empfohlen</div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div v-for="exercise in exercises" class="tile-exercise-featured tile-border--black">
                        <div class="tile-excercise-marker" :style="{ 'background-color': getCategoryColor(exercise.category)}">
                            <i class="material-icons float-right">check</i>
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
                        <div class=" tile-excercise-button">
                            <p>Übung lösen</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-3 tile-border--black">
                    <div class="panel tile-border">
                        <div class="panel-head">
                            Nächstes Level
                        </div>
                        <div class="panel-body">
                            <p>Text</p>
                        </div>
                    </div>
                </div>
                <div class="col-8 tile-border--black">
                    <div class="panel tile-border">
                        <div class="panel-head">
                            Deine Auszeichnungen
                        </div>
                        <div class="panel-body">
                            <p>Text</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
    `
});