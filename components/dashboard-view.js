Vue.component('dashboard-view', {
    data: function () {
        return {
            dashboardName: 'Name',
            notifications: [],
            themen: { },
            layouts: { },
            components: { },
            cols: 10,
            breakpoint: "md",
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            colsAll: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 2 },
            themenAdd: [],
            renderThemenAdd: false,
            addTileWindow: false,
            isDraggable: false,
            readyForRender: false,
            editDashboardName: false,
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
            console.log(response);
            // map themen
            this.themen = response.data.themen;
            // map layout
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
            // map Name
            if (response.data.dashboard.name == undefined){
                this.dashboardName = "Kein Name"
            } else {
                this.dashboardName = response.data.dashboard.name;
            }
            // Alle Daten gefüllt, rendere Layout
            this.readyForRender = true;
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
            const params = new URLSearchParams();
            params.append('id', this.$root.dashboardID);
            params.append('layout', JSON.stringify(this.layouts));
            params.append('mode', 1);
            axios.post(this.getAPIURL() + '/update.php', params)        
            .then((response) => {
                //console.log("Layoutupdate erfolgreich");
                //console.log(response);
            })
            .catch(function (error) {
                //console.log("Notizenupdate gescheitert");
                //console.log(error);
            });
        },
        addTile: function (id, themenAddID) {
            if (this.checkIfThemaExists(id)){
                this.$snotify.warning('Diese Lektion hast du schon hinzugefügt.');
            } else {
                this.readyForRender = false;
                var height = 0;

                for (var tile in this.layouts[this.breakpoint]) {
                    var tempHeight = this.layouts[this.breakpoint][tile].y + this.layouts[this.breakpoint][tile].h;
                    if (height < tempHeight) {
                        height = tempHeight;
                    }
                }
                this.layouts[this.breakpoint].push({ x: 0, y: height, w: 2, h: 8, i: id});
                
                // themen füllen
                //this.themen.push(this.themenAdd[themenAddID]);
                //dB
                const params = new URLSearchParams();
                params.append('mode', 2);
                params.append('dashboard', this.$root.dashboardID);
                params.append('thema', id);
                axios.post(this.getAPIURL() + '/add.php', params)
                .then(function (response) {
                    axios.get(this.getAPIURL() + '/get.php?mode=1&id=' + this.$root.dashboardID)
                    .then((response) => {
                        // map themen
                        this.themen = response.data.themen;
                        this.readyForRender = true;
                        
                        this.layoutUpdatedEvent();
                    })
                }.bind(this))
                .catch(function (error) {
                    console.log("ERROR - Add thema. Message:");
                    console.log(error);
                    this.$snotify.error('Leider gab es einen Fehler!');
                }.bind(this));

                this.components[id] = { i: id, component: "thema-tile", defaultSize: this.themenAdd[themenAddID].size};
                this.addTileWindow = false;
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
        },  
        readyLayout() {
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
        },
        checkIfThemaExists(id) {
            var exists = false;
            for (var them in this.themen) {
                if (this.themen[them].ID == id) {
                    exists = true;
                }
            }
            return exists;
        },
        getThemaData: function (id) {
            for (var them in this.themen) {
                if (this.themen[them].ID == id) {
                    return this.themen[them];
                }
            }
        },
        submitName: function () {

        }
    },
    watch: {
        themenAdd: function () {
            this.renderThemenAdd = true;
        },
        editDashboardName: function (old, newval) {
            if(old === false){
                this.updateDataPoint({table: 'dashboard', cell: 'name', val: this.dashboardName, whereCell: 'ID', whereVal: this.$root.dashboardID, mode: 99});
            }
        }
    },
    computed: {
        
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title">IMDash</span>
                    <span class="title-name" v-if="!editDashboardName" v-on:click="editDashboardName = !editDashboardName">{{dashboardName}} <i class="material-icons title-icon">create</i></span>
                    <span class="title-name" v-else><form v-on:submit.prevent="editDashboardName = !editDashboardName" class="title-form"><input type="text" name="dashboardName" v-model="dashboardName" class="title-form" v-on:focusout="editDashboardName = !editDashboardName" v-focus v-select></form></span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <notification-button></notification-button>
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
                                    :data="getThemaData(item.i)"
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