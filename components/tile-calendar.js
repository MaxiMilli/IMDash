Vue.component('tile-calendar', {
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
        openCalendar: function () {
            $.sweetModal({
                title: 'Kalender',
                content: '<iframe src="https://calendar.google.com/calendar/embed?mode=WEEK&amp;height=600&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=75nst629kqef7qd2t9m33verns%40group.calendar.google.com&amp;color=%23875509&amp;ctz=Europe%2FZurich" style="border-width:0" scrolling="no" frameborder="0" height="600" width="100%"></iframe>'
            });
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
            <div @click="openCalendar" class=" tile-button-link tile-b-l-radius tile-b-r-radius" id="tile-solo" v-bind:style="colorSecundary">
                <p>Kalender öffnen</p>
            </div>
        </div>
        <div class="tile-info">
            <i class="material-icons" style="color: red;">warning</i> Abgabe in 3 Tagen.
        </div>
        <br>
    </div>`
})
