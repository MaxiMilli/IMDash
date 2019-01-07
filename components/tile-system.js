Vue.component('tile-system', {
    inheritAttrs: false,
    props: ['data', 'edit'],
    data() {
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
    created() {
        //this.fetchData();
        //console.log(this.data);
        this.colorPrimary.backgroundColor = this.data.priColor;
        this.colorSecundary.backgroundColor = this.data.secColor;
    },
    methods: {
        openModal: function () {
            this.$root.viewModal = true;
            this.$root.viewModalData = this.data;
        },
        deleteTile: function () {
            this.$emit('delete-tile', this.data.ID);
        },
        openSystem: function () {
            //Hier (internen) Link aus Datenbank holen und auf entsprechende Seite weiterleiten.
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
            <div @click="openSystem" class=" tile-button-link tile-b-l-radius tile-b-r-radius" id="tile-solo" v-bind:style="colorSecundary">
                <p>Öffnen</p>
            </div>
        </div>
        <div class="tile-info">
            <i class="material-icons" style="color: red;">warning</i> Abgabe in 3 Tagen.
        </div>
        <br>
    </div>`
})
