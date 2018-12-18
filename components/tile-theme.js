Vue.component('tile-theme', {
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
        openPresentation: function (e) {
            if (this.data.presentations[0] == undefined) {
                $.sweetModal('Keine Präsentationen vorhanden!');
            } else {
                this.$router.push('/presentation/' + this.data.presentations[0].ID);
                console.log(this.data.presentations[0].ID);
            }
        },
        openFolder: function (e) {
            if (this.data.file[0] == undefined) {
                $.sweetModal('Keine Dateien vorhanden!');
            } else {
                var file_path = this.data.file[0].link;
                var a = document.createElement('A');
                a.href = file_path;
                a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        },
        openStream: function (e) {
            if (this.data.stream[0] == undefined) {
                $.sweetModal('Keinen Stream vorhanden!');
            } else {
                var win = window.open(this.data.stream[0].link, '_blank');
                win.focus();
            }
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
            <div @click="openPresentation" class=" tile-button-link tile-b-l-radius" v-bind:style="colorSecundary">
                <i class="material-icons tile-button-link-icon">tv</i>
            </div>
            <div @click="openFolder" v-bind:style="colorSecundary" class="tile-button-link">
                <i class="material-icons tile-button-link-icon">folder_open</i>
            </div>
            <div @click="openStream" v-bind:style="colorSecundary" class="tile-button-link tile-b-r-radius">
                <i class="material-icons tile-button-link-icon">tap_and_play</i>
            </div>
        </div>
        <div class="tile-info">
            <i class="material-icons" style="color: red;">warning</i> Abgabe in 3 Tagen.
        </div>
        <br>
    </div>`
})
