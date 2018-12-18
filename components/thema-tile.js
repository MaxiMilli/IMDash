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
            },
            colorHover: {
                color: '#f7f7f7'
            },
            activeB1: false,
            activeB2: false,
            activeB3: false
        }
    },
    created () {
        //this.fetchData();
        //console.log(this.data);
        this.colorPrimary.backgroundColor = this.data.priColor;
        this.colorSecundary.backgroundColor = this.data.secColor;
        this.colorHover.backgroundColor = this.data.secColor;
    },  
    methods: {
        openModal: function () {
            this.$root.viewModal = true;
            this.$root.viewModalData = this.data;
        },
        deleteTile: function () {
            this.$emit('delete-tile', this.data.ID);
        },
        openPresentation: function (e) {
            console.log("presentation open");
            console.log(e);
            
        }
    },
    watch: {
        'edit': function () {
            
        },
    },   
    template: `
    <div class="tile tile100 tile-border--black" id="tile-html">
        <div class="tile-move bar" v-show="edit">
            <div class="tile-move-handle">
                <i class="material-icons">open_with</i>
            </div>
            <button class="btn btn-danger" style="top: 0; left: 0; position: absolute;" v-on:click="deleteTile">Entfernen</button>
        </div>
        <div class="tile-head" v-bind:style="colorPrimary">
            {{ data.name }} <button v-on:click="openModal" class="tile-action color-white float-right"><i class="material-icons">arrow_drop_down_circle</i></button>
        </div>
        <div class="tile-img">
            <img id="thema-title-image" :src="data.bild">
        </div>
        <div class="tile-buttons">
            <div @click="openPresentation" @mouseover="activeB1 = !activeB1" :class="{ activeB1: colorHover }" class=" tile-button-link tile-b-l-radius" v-bind:style="colorSecundary">
                <i class="material-icons tile-button-link-icon">tv</i>
            </div>
            <div v-bind:style="colorSecundary" @mouseover="activeB2 = !activeB2" :class="{ activeB2: colorHover }" class="tile-button-link">
                <i class="material-icons tile-button-link-icon">folder_open</i>
            </div>
            <div v-bind:style="colorSecundary" @mouseover="activeB3 = !activeB3" :class="{ activeB3: colorHover }" class="tile-button-link tile-b-r-radius">
                <i class="material-icons tile-button-link-icon">tap_and_play</i>
            </div>
        </div>
        <div class="tile-info">
            <i class="material-icons" style="color: red;">warning</i> Abgabe in 3 Tagen.
        </div>
        <br>
    </div>`
})
