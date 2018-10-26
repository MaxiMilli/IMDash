Vue.component('exercise-solve', {
    data: function () {
        return {
            exercise: [],
            codeBase: {
                javascript: {},
                html: {},
                css: {},
            },
            url: 'http://codepen.io/Mertl/pen/pxQzWb?height=500&theme-id=light&default-tab=js,result',
            showExerciseModal: false,
            jscode: '',
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.getDataPoint('exercise', 'ID',  this.$route.params.id, false).then(function (response) {
            this.exercise = response.data[0];
        
        }.bind(this));

        this.getDataPoint('exerciseCodebase', 'exerciseID',  this.$route.params.id, false).then(function (response) {
            console.log(response);
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
            axios.get('http://codepen.io/Mertl/pen/pxQzWb.js', {crossdomain: true, 'Access-Control-Allow-Origin': 'imdash'})
            .then(function (response) {
                this.jscode = response.data;
            }.bind(this));

            var invocation = new XMLHttpRequest();
            var url = 'http://codepen.io/Mertl/pen/pxQzWb.js';
            if(invocation) {    
                invocation.open('GET', url, true);
                invocation.onreadystatechange = function (val) {
                    console.log(val, invocation)
                };
                invocation.send(); 
            }
        },
    },
    computed: {
        getEmbedUrl: function () {
            //return this.url.replace('pen', 'embed');
            return this.url;
        }
    },
    template: `
    <div>
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
        <div class="container-fluid">
            <div class="tile tile30 tile--spacing tile-border--black">
                <div class="tile-head">
                    {{exercise.name}}
                </div>

                <div class="tile-body">
                    {{exercise.content}}
                </div>
            </div>
            <div class="tile tile60 tile--spacing tile-border--black">
                <div class="tile-head">
                    {{exercise.name}}
                </div>

                <div class="tile-body" style="height: 500px;">

                    <p><button class="btn btn-light" @click="showExerciseModal = true">Übung öffnen</button><br></p>
                    <p>{{jscode}}</p>
                    <!--<iframe height='265' scrolling='no' title='Deformation' :src="[getEmbedUrl + '?height=265&theme-id=light&default-tab=js,result']" frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Mertl/pen/pxQzWb/'>Deformation</a> by Michal (<a href='https://codepen.io/Mertl'>@Mertl</a>) on <a href='https://codepen.io'>CodePen</a>.
                    </iframe>-->
                    <div class="exercise-body-bg" v-if="showExerciseModal">
                        <div class="tile-head">
                            Übung  <a v-on:click="closeModal" class="color-white"><i class="material-icons float-right">close</i></a>
                        </div>

                        <div class="exercise-body">
                            <iframe class="exercise-iframe" :src="getEmbedUrl"></iframe>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `
});