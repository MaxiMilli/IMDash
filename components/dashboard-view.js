Vue.component('dashboard-view', {
    data: function () {
        return {
            addTileWindow: false,
            themen: { },
            notifications: [],
            themenAdd: [],
            renderThemenAdd: false,
            layouts: { },
            breakpoint: "md",
            components: { },
            cols: 10,
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            colsAll: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 2 },
            isDraggable: false,
            readyForRender: false
        }
    },
    mixins: [
        mixinAPI,
        window.VueResponsiveGridLayout.GridItemComponentsMixins
    ],
    mounted: function () {
        // Get Layout and Presentations
        axios.get(this.getAPIURL() + '/get.php?mode=1&id=' + this.$root.dashboardID)
        .then((response) => {
            this.themen = response.data.themen;
            if (response.data.dashboard.layout == ''){
                var obj = {};
            } else {
                var obj = JSON.parse(response.data.dashboard.layout);
            }
            if (jQuery.isEmptyObject(obj)) {
                
                this.layouts[this.breakpoint] = [ ];
                var t = 0;
                for (var them in this.themen) {
                    var single = { x: 0, y: (t * this.themen[t].size), w: 2, h: 8, i: this.themen[t].ID};
                    this.layouts[this.breakpoint].push(single);
                    t++;
                }
                this.layoutUpdatedEvent();
            } else {
                this.layouts = obj;
            }
            var e = 0;
            for (var them in this.themen) {
                this.components[this.themen[e].ID] = { i: this.themen[e].ID, component: "thema-tile", defaultSize: this.themen[e].size};
                e++;
            }
            // Alle Daten gefüllt, rendere das Layout
            this.readyForRender = true;
        })
        .catch(function (error) {
            console.log(error);
        });

        // Get Notifications
        axios.get(this.getAPIURL() + '/get.php?mode=6&id=' + this.$root.userID)
        .then((response) => {
            //console.log(response);
            this.notifications = response.data.notifications;
        })
        .catch(function (error) {
            console.log(error);
        });

        //Get Themen
        this.getDataPoint('thema', 'category', 'THEME', true).then(function (response) {
            response.data.forEach(thema => {
                thema.hover=false;
                thema.headstyle = {
                    backgroundColor: thema.priColor
                }
                this.themenAdd.push(thema);
            });
        }.bind(this));
    },
    methods: {
        scrollHorizontal: function (e) {
            // TODO: Mit der Maus Horizontal scrollen funktioniert noch nicht.
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            $(this).scrollLeft -= (delta*40); // Multiplied by 40
            e.preventDefault();
        },
        layoutUpdatedEvent: function () {
            console.log("update");
            const params = new URLSearchParams();
            params.append('id', this.$root.dashboardID);
            params.append('layout', JSON.stringify(this.layouts));
            params.append('mode', 1);
            axios.post(this.getAPIURL() + '/update.php', params)        
            .then((response) => {
                console.log("Layoutupdate erfolgreich");
                //console.log(response);
            })
            .catch(function (error) {
                //console.log("Notizenupdate gescheitert");
                //console.log(error);
            });
        },
        addTile: function (id, themenAddID) {
            if (this.checkIfThemaExists(id)){
                alert("thema exists");
            } else {
                this.readyForRender = false;
                var height = 0;
                //console.log(this.layouts[this.breakpoint]);
                for (var tile in this.layouts[this.breakpoint]) {
                    console.log(this.layouts[this.breakpoint][tile]);
                    var tempHeight = this.layouts[this.breakpoint][tile].y + this.layouts[this.breakpoint][tile].h;
                    if (height < tempHeight) {
                        height = tempHeight;
                    }
                }

                // themen füllen
                this.themen.push(this.themenAdd[themenAddID]);
                //dB
                const params = new URLSearchParams();
                params.append('mode', 2);
                params.append('dashboard', this.$root.dashboardID);
                params.append('thema', id);
                axios.post(this.getAPIURL() + '/add.php', params)
                .then(function (response) {
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    console.log("ERROR - Add thema. Message:");
                    console.log(error);
                    this.$snotify.error('Leider gab es einen Fehler!');
                }.bind(this));


                this.components[id] = { i: id, component: "thema-tile", defaultSize: 2};
                this.layouts[this.breakpoint].push({ x: 0, y: height, w: 2, h: 8, i: id});
                this.readyForRender = true;
            }
        },
        deleteTile: function (id) {
            //alert("delete");
            this.readyForRender = false;

            // Remove Components
            delete this.components[id];

            // Remove Thema
            for (var thema in this.themen) {
                if (this.themen[thema].ID == id) {
                    delete this.themen[thema];
                }
            }

            // Remove Layout
            for (var layid in this.layouts) {
                var layobj = [];
                for (var ele in this.layouts[layid]) {
                    if (this.layouts[layid][ele].i == id) {
                        //nicht in array schreiben
                    } else {
                        layobj.push(this.layouts[layid][ele]);
                    }
                }
                this.layouts[layid] = layobj;
            }

            // DB
            const params = new URLSearchParams();
            params.append('mode', 3);
            params.append('dashboard', this.$root.dashboardID);
            params.append('thema', id);
            axios.post(this.getAPIURL() + '/add.php', params)
            .then(function (response) {
                this.$snotify.success('Erfolgreich gelöscht.');
                this.isDraggable = false;
                this.readyForRender = true;
            }.bind(this))
            .catch(function (error) {
                console.log("ERROR - Remove thema. Message:");
                console.log(error);
                this.$snotify.error('Leider gab es einen Fehler!');
            }.bind(this));
            this.layoutUpdatedEvent();

            console.log("Erfolgreich gelöscht");
        },  
        readyLayout() {
        	console.log('layout ready');
          this.$refs.layout.initLayout();
        },
        initLayout({layout, cols}) {
            this.cols = cols;
        },
        initWidth({width}) {
            this.containerWidth = width;
        },
        onLayoutSwitched() {
            console.log('layouts switched')
        },
        changeWidth({width, newCols}) {
            this.containerWidth = width;
            this.cols = newCols;
        },
        updateLayout({layout, breakpoint}) {
            let filtered;
            filtered = layout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})
            this.layouts[breakpoint] = filtered;
            this.layoutUpdatedEvent();
        },
        changeBreakpoint({breakpoint, cols}) {
            this.cols = cols;
            this.breakpoint = breakpoint;
        },
        changeLayout({layout, breakpoint}) {
            let filtered;
            filtered = layout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})
            this.layouts[breakpoint] = filtered;
        },
        gridMode() {
            this.$refs.layout.resizeAllItems(false, false);
        },
        listMode() {
            this.$refs.layout.resizeAllItems(true, false);
        },
        resizedLayout() {
            console.log('layout resized')
        },
        checkIfThemaExists(id) {
            var exists = false;
            for (var them in this.themen) {
                if (this.themen[them].ID == id) {
                    exists = true;
                }
            }
            return exists;
        }
    },
    watch: {
        themenAdd: function () {
            this.renderThemenAdd = true;
        }
    },
    computed: {

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
                    <a href="#" class="title-button float-right" v-on:click="addTileWindow = !addTileWindow"><i class="material-icons">add</i></a>
                    <a href="#" class="title-button float-right" v-on:click="isDraggable = !isDraggable"><i class="material-icons">edit</i></a>
                </div>
            </div>
        </div>
        <transition name="fade" mode="in-out">
            <div class="container-fluid" v-if="addTileWindow">
                <div class="row hide-add-tile">
                    <div class="add-tile-section" v-on:scroll="scrollHorizontal">
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>

                            <div v-for="(thema, id) in themenAdd" v-if="renderThemenAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile(thema.ID, id)">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-head" :style="thema.headstyle">{{thema.name}}</div>
                                <div class="tile-body">
                                    <div class="tile-img-prv">
                                        <img :src="thema.bild">
                                    </div>
                                    <div class="tile-buttons">
                                        <p>Content</p>
                                    </div>
                                </div>
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
                    <vue-responsive-grid-layout
                    v-if="readyForRender"
                    @width-init="initWidth"
                    @layout-update="updateLayout" 
                    @layout-change="changeLayout" 
                    @layout-switched="onLayoutSwitched" 
                    @layout-ready="readyLayout" 
                    @layout-init="initLayout" 
                    @layout-resized="resizedLayout" 
                    @width-change="changeWidth" 
                    @breakpoint-change="changeBreakpoint"
                    :layouts="layouts" 
                    :cols="cols" 
                    :compact-type="'vertical'" 
                    :vertical-compact="true" 
                    :init-on-start="false" 
                    :breakpoint="breakpoint" 
                    :breakpoints="breakpoints" 
                    :cols-all="colsAll" 
                    ref="layout">
                        <template slot-scope="props">
                            <vue-grid-item 
                            v-for="(item, keyID) in props.layout"
                            :key="item.i"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            :cols="props.cols"
                            :container-width="props.containerWidth"
                            :default-size="components[item.i].defaultSize"
                            :is-draggable="isDraggable"
                            :is-resizable="isDraggable"
                            :height-from-children="true"
                            :can-be-resized-with-all="true">
                                <thema-tile
                                    :id="item.i"
                                    :data="themen[keyID]"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </thema-tile>
                            </vue-grid-item>
                        </template>
                    </vue-responsive-grid-layout> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});

/*

:component="components[item.i].component"
                            :component-props="{ id : item.i, data: themen[keyID], edit: isDraggable, @delete-tile: deleteTile}"

                            */