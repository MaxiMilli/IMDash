Vue.component('dashboard-view', {
    data: function () {
        return {
            dashID: 0,
            dashboardName: 'Name',
            notifications: [],
            themen: {},
            layouts: {},
            components: {},
            cols: 10,
            breakpoint: "md",
            breakpoints: {
                lg: 1200,
                md: 996,
                sm: 768,
                xs: 480,
                xxs: 0
            },
            colsAll: {
                lg: 10,
                md: 8,
                sm: 6,
                xs: 4,
                xxs: 2
            },
            calendarAdd: [],
            dashboardAdd: [],
            linkAdd: [],
            systemAdd: [],
            themenAdd: [],
            renderCalendarAdd: false,
            renderDashboardAdd: false,
            renderLinkAdd: false,
            renderSystemAdd: false,
            renderThemenAdd: false,
            addTileWindow: false,
            isDraggable: false,
            readyForRender: false,
            editDashboardName: false,
            tileRender: false,
        }
    },
    mixins: [
        mixinAPI,
        window.VueResponsiveGridLayout.GridItemComponentsMixins
    ],
    mounted: function () {
        this.dashID = this.$root.dashboardID;
        this.tileRender = false;
        this.createDashboardView();

        var filterVal = 'blur(0px)';
        $('#content').css({
            'filter': filterVal,
            'webkitFilter': filterVal,
            'mozFilter': filterVal,
            'oFilter': filterVal,
            'msFilter': filterVal,
            'transition': 'all 0.5s ease-out',
            '-webkit-transition': 'all 0.5s ease-out',
            '-moz-transition': 'all 0.5s ease-out',
            '-o-transition': 'all 0.5s ease-out'
        });
    },
    methods: {
        createDashboardView: function () {

            // Get Layout and Presentations
            axios.get(this.getAPIURL() + '/get.php?mode=1&id=' + this.$root.dashboardID)
                .then((response) => {
                    console.log(this.$root.dashboardID);
                    console.log(response);
                    // map themen
                    this.themen = response.data.themen;
                    // map layout
                    if (response.data.dashboard.layout == '') {
                        var obj = {};
                    } else {
                        var obj = JSON.parse(response.data.dashboard.layout);
                    }
                    if (jQuery.isEmptyObject(obj)) {

                        this.layouts[this.breakpoint] = [];
                        var t = 0;
                        for (var them in this.themen) {
                            var single = {
                                x: 0,
                                y: (t * this.themen[t].size),
                                w: 2,
                                h: 8,
                                i: this.themen[t].ID
                            };
                            this.layouts[this.breakpoint].push(single);
                            t++;
                        }
                        this.layoutUpdatedEvent();
                    } else {
                        this.layouts = obj;
                    }
                    var e = 0;
                    for (var them in this.themen) {
                        this.components[this.themen[e].ID] = {
                            i: this.themen[e].ID,
                            component: "thema-tile",
                            defaultSize: this.themen[e].size
                        };
                        e++;
                    }
                    // map Name
                    if (response.data.dashboard.name == undefined) {
                        this.dashboardName = "Kein Name"
                    } else {
                        this.dashboardName = response.data.dashboard.name;
                    }
                    // Alle Daten gefüllt, rendere Layout
                    this.readyForRender = true;
                    this.tileRender = true;
                })
                .catch(function (error) {
                    console.log(error);
                });

            //Get Calendars
            this.getDataPoint('thema', 'category', 'CALENDAR', true).then(function (response) {
                response.data.forEach((cal) => {
                    cal.hover = false;
                    cal.headstyle = {
                        backgroundColor: cal.priColor
                    }
                    this.calendarAdd.push(cal);
                });
            }.bind(this));

            //Get Dashboards
            this.getDataPoint('thema', 'category', 'DASHBOARD', true).then(function (response) {
                response.data.forEach((dash) => {
                    dash.hover = false;
                    dash.headstyle = {
                        backgroundColor: dash.priColor
                    }
                    this.dashboardAdd.push(dash);
                });
            }.bind(this));

            //Get Links
            this.getDataPoint('thema', 'category', 'LINK', true).then(function (response) {
                response.data.forEach((link) => {
                    link.hover = false;
                    link.headstyle = {
                        backgroundColor: link.priColor
                    }
                    this.linkAdd.push(link);
                });
            }.bind(this));

            //Get Systems
            this.getDataPoint('thema', 'category', 'SYSTEM', true).then(function (response) {
                response.data.forEach((system) => {
                    system.hover = false;
                    system.headstyle = {
                        backgroundColor: system.priColor
                    }
                    this.systemAdd.push(system);
                });
            }.bind(this));

            //Get Themes
            this.getDataPoint('thema', 'category', 'THEME', true).then(function (response) {
                response.data.forEach((thema) => {
                    thema.hover = false;
                    thema.headstyle = {
                        backgroundColor: thema.priColor
                    }
                    this.themenAdd.push(thema);
                });
            }.bind(this));
        },
        scrollHorizontal: function (e) {
            // TODO: Mit der Maus Horizontal scrollen funktioniert noch nicht.
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            $(this).scrollLeft -= (delta * 40); // Multiplied by 40
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
            if (this.checkIfThemaExists(id)) {
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
                this.layouts[this.breakpoint].push({
                    x: 0,
                    y: height,
                    w: 2,
                    h: 8,
                    i: id
                });

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

                this.components[id] = {
                    i: id,
                    component: "thema-tile",
                    defaultSize: this.themenAdd[themenAddID].size
                };
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
        initLayout({
            layout,
            cols
        }) {
            this.cols = cols;
        },
        initWidth({
            width
        }) {
            this.containerWidth = width;
        },
        onLayoutSwitched() {
            console.log('layouts switched')
        },
        changeWidth({
            width,
            newCols
        }) {
            this.containerWidth = width;
            this.cols = newCols;
        },
        updateLayout({
            layout,
            breakpoint
        }) {
            let filtered;
            filtered = layout.map((item) => {
                return {
                    x: item.x,
                    y: item.y,
                    w: item.w,
                    h: item.h,
                    i: item.i
                }
            })
            this.layouts[breakpoint] = filtered;
            this.layoutUpdatedEvent();
        },
        changeBreakpoint({
            breakpoint,
            cols
        }) {
            this.cols = cols;
            this.breakpoint = breakpoint;
        },
        changeLayout({
            layout,
            breakpoint
        }) {
            let filtered;
            filtered = layout.map((item) => {
                return {
                    x: item.x,
                    y: item.y,
                    w: item.w,
                    h: item.h,
                    i: item.i
                }
            })
            this.layouts[breakpoint] = filtered;
        },
        gridMode() {
            this.$refs.layout.resizeAllItems(false, false);
        },
        listMode() {
            this.$refs.layout.resizeAllItems(true, false);
        },
        resizedLayout() {},
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

        },
        isCategory: function(ele, cat) {
            if (ele === cat) {
                return true;
            } else {
                return false;
            }
        }
    },
    watch: {
        calendarAdd: function () {
            this.renderCalendarAdd = true;
        },
        dashboardAdd: function () {
            this.renderDashboardAdd = true;
        },
        linkAdd: function () {
            this.renderLinkAdd = true;
        },
        systemAdd: function () {
            this.renderSystemAdd = true;
        },
        themenAdd: function () {
            this.renderThemenAdd = true;
        },
        editDashboardName: function (old, newval) {
            if (old === false) {
                this.updateDataPoint({
                    table: 'dashboard',
                    cell: 'name',
                    val: this.dashboardName,
                    whereCell: 'ID',
                    whereVal: this.$root.dashboardID,
                    mode: 99
                });
            }
        }
    },
    computed: {
        getRouteID: function () {
            var newID = this.$route.params.id;
            this.$root.dashboardID = newID;
            this.dashID = newID;
            this.tileRender = false;
            this.createDashboardView();
        }
    },
    template: `
    <div class="dashboard-view">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <span class="title-site">IMDash</span>
                    <span class="title-name" v-if="!editDashboardName" v-on:click="editDashboardName = !editDashboardName" style="cursor: pointer;">{{dashboardName}} <i class="material-icons title-icon">create</i></span>
                    <span class="title-name" v-else><form v-on:submit.prevent="editDashboardName = !editDashboardName" class="title-form"><input type="text" name="dashboardName" v-model="dashboardName" class="title-form" v-on:focusout="editDashboardName = !editDashboardName" v-focus v-select></form></span>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <notification-button></notification-button>
                    <button class="title-button float-right" v-on:click="addTileWindow = !addTileWindow"><i class="material-icons">add</i></button>
                    <button class="title-button float-right" v-on:click="isDraggable = !isDraggable">
                        <i class="material-icons" v-if="!isDraggable">edit</i>
                        <i class="material-icons" v-else>check</i>
                    </button>
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
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false && checkIfThemaExists(thema.ID)" style="background-color:rgba(255,255,255,0.5)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-add">
                                    <div class="tile-add-img-prv">
                                            <img :src="thema.bild">
                                    </div>
                                    <div class="tile-add-head" :style="thema.headstyle">{{thema.name}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="add-tile-column">
                            <div class="page-menu-title">kalender</div>
                            <div v-for="(thema, id) in calendarAdd" v-if="renderCalendarAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile(thema.ID, id)">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false && checkIfThemaExists(thema.ID)" style="background-color:rgba(255,255,255,0.5)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-add">
                                    <div class="tile-add-img-prv">
                                            <img :src="thema.bild">
                                    </div>
                                    <div class="tile-add-head" :style="thema.headstyle">{{thema.name}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="add-tile-column">
                            <div class="page-menu-title">links</div>
                            <div v-for="(thema, id) in linkAdd" v-if="renderLinkAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile(thema.ID, id)">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false && checkIfThemaExists(thema.ID)" style="background-color:rgba(255,255,255,0.5)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-add">
                                    <div class="tile-add-img-prv">
                                            <img :src="thema.bild">
                                    </div>
                                    <div class="tile-add-head" :style="thema.headstyle">{{thema.name}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="add-tile-column">
                            <div class="page-menu-title">dashboards</div>
                            <div v-for="(thema, id) in dashboardAdd" v-if="renderDashboardAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile(thema.ID, id)">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false && checkIfThemaExists(thema.ID)" style="background-color:rgba(255,255,255,0.5)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-add">
                                    <div class="tile-add-img-prv">
                                            <img :src="thema.bild">
                                    </div>
                                    <div class="tile-add-head" :style="thema.headstyle">{{thema.name}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="add-tile-column">
                            <div class="page-menu-title">system</div>
                            <div v-for="(thema, id) in systemAdd" v-if="renderSystemAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile(thema.ID, id)">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false && checkIfThemaExists(thema.ID)" style="background-color:rgba(255,255,255,0.5)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle" v-if="!checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">add</i>
                                    </div>
                                    <div class="tile-move-handle" v-if="checkIfThemaExists(thema.ID)">
                                        <i class="material-icons">close</i>
                                    </div>
                                </div>
                                <div class="tile-add">
                                    <div class="tile-add-img-prv">
                                            <img :src="thema.bild">
                                    </div>
                                    <div class="tile-add-head" :style="thema.headstyle">{{thema.name}}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
        <div class="container" v-if="tileRender">
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

                                <tile-theme
                                    v-if="getThemaData(item.i).category == 'THEME'"
                                    :id="item.i"
                                    :data="getThemaData(item.i)"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </tile-theme>
                                <tile-calendar
                                    v-else-if="getThemaData(item.i).category == 'CALENDAR'"
                                    :id="item.i"
                                    :data="getThemaData(item.i)"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </tile-calendar>
                                <tile-dashboard
                                    v-else-if="getThemaData(item.i).category == 'DASHBOARD'"
                                    :id="item.i"
                                    :data="getThemaData(item.i)"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </tile-dashboard>
                                <tile-link
                                    v-else-if="getThemaData(item.i).category == 'LINK'"
                                    :id="item.i"
                                    :data="getThemaData(item.i)"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </tile-link>
                                <tile-system
                                    v-else-if="getThemaData(item.i).category == 'SYSTEM'"
                                    :id="item.i"
                                    :data="getThemaData(item.i)"
                                    :edit="isDraggable"
                                    @delete-tile="deleteTile">
                                </tile-system>
                                
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
