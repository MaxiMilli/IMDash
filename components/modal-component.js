Vue.component('modal-component', {
    props: ['themadata'],
    data () {
        return {
            loading: false,
            presentationObject: {},
            themaObject: {},
            bgc: {
                backgroundColor: this.themadata.priColor
            }
        }
    },
    methods: {
        closeModal: function () {
            this.$root.viewModal = false;
        }
    },
    created () {
    },
    watch: {
    },
    template: `
    <div class="modal">
        <div class="themeModal tile-border--black" id="themeModal">
            <div class="modal-guts">
                <div class="modal-head" v-bind:style="bgc">
                    {{ themadata.name }} <a href="#" v-on:click="closeModal" class="color-white"><i class="material-icons float-right">close</i></a>
                </div>
                <div class="modal-files">
                    <div class="modal-column">
                        <div class="modal-column-head">Vorlesungen</div>
                        <div class="modal-column-list-container">
                            <router-link class="modal-column-list-item" v-for="item in themadata.presentations" v-on:click="closeModal" :to="{ path: '/presentation/' + item.ID}">
                                <i class="material-icons">desktop_windows</i> {{ item.fileName }}
                            </router-link>
                            <span v-if="themadata.presentations.length == 0" class="modal-column-list-noentry"><br><br>Keine Präsentationen vorhanden </span>
                        </div>
                    </div>
                    <div class="modal-column">
                        <div class="modal-column-head">Übungen</div>
                        <div class="modal-column-list-container">
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                            <div class="modal-column-list-item"><i class="material-icons">code</i> Test1</div>
                        </div>
                    </div>
                    <div class="modal-column">
                        <div class="modal-column-head">Stream</div>
                        <hr width="70%" align="left">
                        <div class="modal-column-head">Aufzeichnungen</div>
                        <div class="modal-column-list-container">
                            <div class="modal-column-list-item"><i class="material-icons">ondemand_video</i> Aufzeichnung</div>
                            <div class="modal-column-list-item"><i class="material-icons">ondemand_video</i> Aufzeichnung</div>
                            <div class="modal-column-list-item"><i class="material-icons">ondemand_video</i> Aufzeichnung</div>
                        </div>
                    </div>
                    <div class="modal-column">
                        <div class="modal-column-head">Dokumente</div>
                        <div class="modal-column-list-container">
                            <div class="modal-column-list-item"><i class="material-icons">insert_drive_file</i> Dokument</div>
                            <div class="modal-column-list-item"><i class="material-icons">insert_drive_file</i> Dokument</div>
                            <div class="modal-column-list-item"><i class="material-icons">insert_drive_file</i> Dokument</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-overlay" id="modal-overlay" v-on:click="closeModal"></div>
    </div>`
  })