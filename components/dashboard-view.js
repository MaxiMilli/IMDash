Vue.component('dashboard-view', {
    data: function () {
        return {
            viewFunctions: {
                addTile: false,
            },
            themen: { },
            dashboard: {},
            dashboardLayout: [],
            notifications: [],
            themenAdd: [],
            renderThemenAdd: false,
            screenWidth: window.innerWidth,
            layouts: { 1 : { } },
            currentLayoutsId: 1,
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
            this.dashboard = response.data.dashboard;
            var obj = JSON.parse(response.data.dashboard.layout);
            if (obj === {}) {
                console.log("layout neu")
                var t = 0;
                for (var them in this.themen) {
                    this.layouts[1].push({ x: 0, y: (t * this.themen[t].size), w: 2, h: 8, i: String(t+1)});
                    t++;
                }
            } else {
                console.log("layout aus DB");
                console.log(obj);
                this.layouts[1] = obj;
            }
            var e = 0;
            for (var them in this.themen) {
                this.components[e+1] = { i: String(e+1), component: "thema-tile", defaultSize: this.themen[e].size}
                e++;
            }

            
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
        window.addEventListener("resize", ()=> this.screenWidth = window.innerWidth);
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
            console.log("update");
            const params = new URLSearchParams();
            params.append('id', this.dashboard.ID);
            params.append('layout', JSON.stringify(this.layouts[1]));
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
        },
        addTile: function () {
            alert("addTile");
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
        switchLayout() {
            switch(this.currentLayoutsId) {
                case 1:
                    this.currentLayoutsId = 2;
                    this.$refs.layout.switchLayout(this.currentLayouts);
                    break;
                case 2:
                    this.currentLayoutsId = 1;
                    this.$refs.layout.switchLayout(this.currentLayouts);
                    break;
            }
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
            this.layouts[1][breakpoint] = filtered;
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
        }
    },
    watch: {
        themenAdd: function () {
            this.renderThemenAdd = true;
        },
        screenWidth: function (old, newWidth) {
            console.log(newWidth);
        }
    },
    computed: {
        dashboardCols: function () { 
            if (this.screenWidth < 900) {
                return 4;
            } else {
                return 6;
            }
        },
        currentLayouts() {
            return this.layouts[this.currentLayoutsId];
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
                    <a href="#" class="title-button float-right" v-on:click="isDraggable = !isDraggable"><i class="material-icons">edit</i></a>
                </div>
            </div>
        </div>
        <transition name="fade" mode="in-out">
            <div class="container-fluid" v-if="viewFunctions.addTile">
                <div class="row hide-add-tile">
                    <div class="add-tile-section" v-on:scroll="scrollHorizontal">
                        <div class="add-tile-column">
                            <div class="page-menu-title">themen</div>
                            <div v-for="(thema, id) in themenAdd" v-if="renderThemenAdd" class="tile-xs tile100-preview tile-border--black" @click="addTile">
                                <div class="tile-overlay" @mouseenter="thema.hover=true" v-if="thema.hover == false" style="background-color:rgba(255,255,255,0.0)">
                                </div>
                                <div class="tile-overlay" @mouseleave="thema.hover=false" v-if="thema.hover == true" style="background-color:rgba(255,255,255,0.5)">
                                    <div class="tile-move-handle">
                                        <i class="material-icons">add</i>
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
                    :layouts="currentLayouts" 
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
                            :component="components[item.i].component"
                            :component-props="{ id : item.i, data: themen[item.i-1], edit: isDraggable}"
                            :default-size="components[item.i].defaultSize"
                            :is-draggable="isDraggable"
                            :is-resizable="isDraggable"
                            :height-from-children="true"
                            :can-be-resized-with-all="true">
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