Vue.component('exercise-solve', {
    data: function () {
        return {
            exercise: [],
            codeBase: {
                javascript: {},
                html: {},
                css: {},
            },
            url: 'https://codepen.io/negarjf/pen/MzwYGz?height=500&theme-id=light&default-tab=js,result',
            embed: 'https://codepen.io/negarjf/embed/MzwYGz?default-tab=result',
            showExerciseModal: false,
            htmlcode: '',
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.getDataPoint('exercise', 'ID', this.$route.params.id, false).then(function (response) {
            this.exercise = response.data[0];

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
                            that.htmlcode = data;
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

        }
    },
    computed: {
        getEmbedUrl: function () {
            //return this.url.replace('pen', 'embed');
            return this.url;
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
            <hr>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="panel tile-border--black">
                    <div class="tile-head">
                        {{exercise.name}}
                    </div>
                    <div class="tile-body column">
                        {{exercise.content}}
                        <br>
                        <button class="btn-excercise-solve" @click="showExerciseModal = true"><p>Übung lösen!</p></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});
