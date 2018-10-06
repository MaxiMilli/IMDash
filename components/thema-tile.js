

Vue.component('thema-tile', {
    inheritAttrs: false,
    props: ['data', 'edit'],
    data () {
        return {
            tname: null,
            imageURL: '',
            colorPrimary: {
                backgroundColor: ''
            },
            colorSecundary: {
                backgroundColor: ''
            }
        }
    },
    created () {
        //this.fetchData();
        //console.log(this.data);
        this.colorPrimary.backgroundColor = this.data.priColor;
        this.colorSecundary.backgroundColor = this.data.secColor;
        console.log(this.data);
    },  
    methods: {
        openModal: function () {
            this.$root.viewModal = true;
            this.$root.viewModalData = this.data;
        }
    },
    watch: {
        'edit': function () {
            console.log("edit changed");
        },
    },
    template: `
    <div class="tile tile100 tile-border--black" id="tile-html" :data-item-id="data.ID">
        <div class="tile-move bar" v-show="edit">
            <div class="tile-move-handle">
                <i class="material-icons">open_with</i>
            </div>
        </div>
        <div class="tile-head" v-bind:style="colorPrimary">
            {{ data.name }} <a href="#" v-on:click="openModal"><i class="material-icons float-right">arrow_drop_down_circle</i></a>
        </div>
        <div class="tile-img">
            <img id="thema-title-image" :src="data.bild">
        </div>
        <div class="tile-buttons">
            <div class="tile-button-link tile-b-l-radius" v-bind:style="colorSecundary">
                <i class="material-icons tile-button-link-icon">tv</i>
            </div>
            <div class="tile-button-link" v-bind:style="colorSecundary">
                <i class="material-icons tile-button-link-icon">folder_open</i>
            </div>
            <div class="tile-button-link tile-b-r-radius" v-bind:style="colorSecundary">
                <i class="material-icons tile-button-link-icon">tap_and_play</i>
            </div>
        </div>
        <div class="tile-info">
            <i class="material-icons" style="color: red;">warning</i> Abgabe in 3 Tagen.
        </div>
        <br>
    </div>`
})