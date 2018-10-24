Vue.component('notification-button', {
    data: function () {
        return {
            notifications: [],
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        // Get Notifications
        axios.get(this.getAPIURL() + '/get.php?mode=6&id=' + this.$root.userID)
        .then((response) => {
            //console.log(response);
            this.notifications = response.data.notifications;
        })
        .catch(function (error) {
            console.log("ERROR - unable to load Notifications:");
            console.log(error);
        });
    },
    methods: {
        toggleMenu: function () {
        },
    },
    template: `
    <div>
        <button class="btn title-button float-right" v-tippy="{ html : '#notificationsPanel', reactive : true, interactive : true, placement : 'bottom', theme: 'light', trigger: 'click' }"><i class="material-icons">notifications</i></button>
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
    </div>
    `
});