Vue.component('dashboard-view', {
    data: function () {
        return {
            viewFunctions: {
                addTile: false,
            },
            themen: {},
            dashboard: {},
            moveTile: false,
            dashboardLayout: [],
            notifications: []
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        // Get Layout and Presentations
        axios.get(this.getAPIURL() + '/get.php?mode=1&id=' + this.$root.dashboardID)
        .then((response) => {
            this.themen = response.data.themen;
            this.dashboard = response.data.dashboard;
            var obj = JSON.parse(response.data.dashboard.layout);
            var arrayLength = obj.length;
            for (var i = 0; i < arrayLength; i++) {
                this.dashboardLayout.push(obj[i]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

        // Get Notifications
        axios.get(this.getAPIURL() + '/get.php?mode=6&id=' + this.$root.userID)
        .then((response) => {
            console.log(response);
            this.notifications = response.data.notifications;
        })
        .catch(function (error) {
            console.log(error);
        });


    },
    methods: {
        toggleAddTile: function () {
            this.viewFunctions.addTile = !this.viewFunctions.addTile;
        },
        scrollHorizontal: function (e) {
            // TODO: Mit der Maus Horizontal scrollen funktioniert noch nicht.
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            $(this).scrollLeft -= (delta*40); // Multiplied by 40
            e.preventDefault();
        },
        layoutUpdatedEvent: function () {
            const params = new URLSearchParams();
            params.append('id', this.dashboard.ID);
            params.append('layout', JSON.stringify(this.dashboardLayout));
            params.append('mode', 1);
            axios.post(this.getAPIURL() + '/update.php', params)        
            .then((response) => {
                //console.log("Notizenupdate Erfolgreich");
                //console.log(response);
            })
            .catch(function (error) {
                //console.log("Notizenupdate gescheitert");
                //console.log(error);
            });
        }
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <span class="title">IMDash</span>
                </div>
                <div class="col-6">
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
                    <a href="#" class="title-button float-right" v-on:click="toggleAddTile"><i class="material-icons">add</i></a>
                    <a href="#" class="title-button float-right" v-on:click="moveTile = !moveTile"><i class="material-icons">edit</i></a>
                </div>
            </div>
        </div>
        <transition name="fade" mode="in-out">
            <div class="container-fluid" v-if="viewFunctions.addTile">
                <div class="row hide-add-tile">
                    <div class="add-tile-section" v-on:scroll="scrollHorizontal">
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>
                            <div class="tile tile100-preview tile-border--black">
                                <div class="tile-head">TypeScript</div>
                                <div class="tile-body">
                                    <div class="tile-img">
                                        <img src="../view/img/html5.png">
                                    </div>
                                </div>
                                <div class="tile-move">move</div>
                            </div>
                        </div>
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>  
                        </div>
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>
                        </div>
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>   
                        </div>
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>
                        </div>
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>   
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="overlay">

                    </div>
                    <grid-layout 
                    :layout="dashboardLayout"
                    :col-num="6"
                    :row-height="90"
                    :is-draggable="moveTile"
                    :is-resizable="moveTile"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
                    @layout-updated="layoutUpdatedEvent">
                        <grid-item v-for="(item, key) in dashboardLayout"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i">
                                    <thema-tile
                                        :data="themen[key]"
                                        :edit="moveTile"
                                        :key="item.i"
                                        ></thema-tile>
                            </grid-item>
                    </grid-layout> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});