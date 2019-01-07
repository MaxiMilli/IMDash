Vue.component('exercise-solve', {
    data: function () {
        return {
            exercise: [],
            codeBase: {
                javascript: {},
                js_t: false,
                html: {},
                html_t: false,
                css: {},
                css_t: false,
            },
            url: 'https://codepen.io/negarjf/pen/MzwYGz?height=500&theme-id=light&default-tab=js,result',
            showExerciseModal: false,
            htmlcode: '',
            renderExercise: false
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.getDataPoint('exercise', 'ID', this.$route.params.id, false).then(function (response) {
            this.exercise = response.data[0];
            this.renderExercise = true;
        }.bind(this));

        this.getDataPoint('exerciseCodebase', 'exerciseID', this.$route.params.id, false).then(function (response) {

            var js = JSON.parse(response.data[0].js);
            var html = JSON.parse(response.data[0].html);
            var css = JSON.parse(response.data[0].css);

            this.codeBase.javascript = js.files;
            this.codeBase.html = html.files;
            this.codeBase.css = css.files;

        }.bind(this));

        if (this.$root.showModal == true) {
            this.$root.showModal == false;
        }
    },
    methods: {
        closeModal: function () {
            this.showExerciseModal = false;
            var invocation = new XMLHttpRequest();
            var url = 'https://codepen.io/negarjf/pen/MzwYGz.html';
            var that = this;
            if (invocation) {
                invocation.open('GET', url, true);
                invocation.onreadystatechange = function (val) {
                    if (invocation.readyState == 4) {
                        if (invocation.status == 200) {
                            var data = invocation.responseText;
                            that.codeBase.html = data;
                        }
                    }
                    //this.htmlcode = invocation.htmlcode;
                };
                invocation.send();
            }
        },
        showExercise: function () {
            $.sweetModal({
                title: 'Übung: ' + this.exercise.name,
                content: this.exercise.content
            });
        },
        placeExercise: function () {
            // Save code

            var invocation = new XMLHttpRequest();
            var url = this.exercise.link + '.html';
            var that = this;
            if (invocation) {
                invocation.open('GET', url, true);
                invocation.onreadystatechange = function (val) {
                    if (invocation.readyState == 4) {
                        if (invocation.status == 200) {
                            var data = invocation.responseText;
                            that.codeBase.html = data;
                            that.codeBase.html_t = true;
                            that.updateDB();
                        }
                    }
                    //this.htmlcode = invocation.htmlcode;
                };
                invocation.send();
            }

            var invocation2 = new XMLHttpRequest();
            var url = this.exercise.link + '.css';
            var that = this;
            if (invocation2) {
                invocation2.open('GET', url, true);
                invocation2.onreadystatechange = function (val) {
                    if (invocation2.readyState == 4) {
                        if (invocation2.status == 200) {
                            var data = invocation2.responseText;
                            that.codeBase.css = data;
                            that.codeBase.css_t = true;
                            that.updateDB();
                        }
                    }
                    //this.htmlcode = invocation.htmlcode;
                };
                invocation2.send();
            }

            var invocation3 = new XMLHttpRequest();
            var url = this.exercise.link + '.js';
            var that = this;
            if (invocation3) {
                invocation3.open('GET', url, true);
                invocation3.onreadystatechange = function (val) {
                    if (invocation3.readyState == 4) {
                        if (invocation3.status == 200) {
                            var data = invocation3.responseText;
                            that.codeBase.javascript = data;
                            that.codeBase.js_t = true;
                            that.updateDB();
                        }
                    }
                    //this.htmlcode = invocation.htmlcode;
                };
                invocation3.send();
            }
        },
        updateDB: function () {
            if (this.codeBase.html_t === true && this.codeBase.js_t === true && this.codeBase.css_t === true) {
                console.log("update Table");
                this.updateDataPoint({
                    mode: 3,
                    userID: this.$root.userID,
                    exerciseID: this.$route.params.id,
                    html: this.codeBase.html,
                    css: this.codeBase.css,
                    js: this.codeBase.javascript
                });

                // Push Page to Rating
                this.$router.push('/exercise/rating/' + this.exercise.ID )
            }
        }
    },
    computed: {
        getEmbedUrl: function () {
            var tempurl = this.exercise.link;
            var embed = tempurl.replace('/pen', '/embed');
            embed += '?default-tab=result';
            return embed;
        },
        getPenUrl: function () {
            var tempurl = this.exercise.link;
            tempurl += '?theme-id=light&default-tab=js,result';
            return this.exercise.link;
        }
    },
    template: `
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

        <div class="row">
            <div class="col-12" v-if="renderExercise">
                <div class="panel tile-border--black">
                    <div class="tile-head">
                        {{exercise.name}}
                    </div>
                    <div class="tile-body column">
                        {{exercise.content}}
                        <iframe :src="getEmbedUrl" class="exercise-preview-iframe"></iframe>
                        <br>
                        <button class="btn-excercise-solve" @click="showExerciseModal = true"><p>Übung lösen!</p></button>
                    </div>
                </div>
                <div class="" style="height: 500px;">
                    <div class="exercise-body-bg" v-if="showExerciseModal">
                        <div class="tile-head" style="height: 65px;">
                            Übung   
                                <button class="btn btn-danger float-right" @click="closeModal">Schliessen</button>
                                <button class="btn btn-light float-right" @click="showExercise">Aufgabe anzeigen</button>
                                <button class="btn btn-success float-right" @click="placeExercise">Abgeben</button> 
                        </div>
                        <div class="exercise-body" style="height: 80%;">
                            <iframe height='265' scrolling='no' title='Deformation' :src="getPenUrl" frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; height: 80vh' id='exsolution'>
                                See the Pen <a href='https://codepen.io/Mertl/pen/pxQzWb/'>Deformation</a> by Michal (<a href='https://codepen.io/Mertl'>@Mertl</a>) on <a href='https://codepen.io'>CodePen</a>.
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});
