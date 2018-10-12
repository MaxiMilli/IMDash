Vue.component('presentation-view', {
    data: function () {
        return {
            url: '',
            loading: false, // TODO: loading zum laufen bringen.
            fullscreenIsActive: false,
            renderPages: false,
            pdf: {
                pdfObject: undefined,
                totalPages: 0,
                currentPage: 0
            },
            standardNoteText: 'Text mit einem Klick hinzufügen...',
            globalNoteEdit: 0,
            noteset: [],
            /* Für die Suche */
            value: '',
            suggestionAttribute: 'name',
            suggestions: [],
            selectedEvent: ""
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        // Close Modal, wenn nicht schon vorher geschehen.
        this.$root.viewModal = false;
        this.getDocument()
        this.getNotes();
    },
    methods: {
        toggleAddTile: function () {
            this.viewFunctions.addTile = !this.viewFunctions.addTile;
        },
        toggleFullscreen: function () {
            if (this.fullscreenIsActive == false) {
                this.fullscreenIsActive = true;
                $('body').prepend($('.panel-body-pdf'));
                $('.panel-body-pdf').addClass('fullscreen');
                $('#panel-pdf-view-id').addClass('panel-pdf-view-id--fullscreen');
            } else {
                this.fullscreenIsActive = false;
                $('.panel-head').after($('.panel-body-pdf'));
                $('.panel-body-pdf').removeClass('fullscreen');
                $('#panel-pdf-view-id').removeClass('panel-pdf-view-id--fullscreen');
            }
        },
        scrollPos: function () {
            var div = $('.reihe').offset().top - $('#panel-pdf-view-id').offset().top;
            var progress = (div / $('#panel-pdf-view-id')[0].scrollHeight) * 100;
            $('.panel-statusbar-progress').width(progress * -1 + "%");  
            var $pages = 0;
            $('.reihe').each(function (key, element) {
                if ($('#panel-pdf-view-id').scrollTop() >= $('.reihe')[key].offsetTop - 10 - $('#panel-pdf-view-id')[0].offsetTop) { $pages++; }
            });
            if (this.pdf.currentPage != $pages) { this.pdf.currentPage = $pages; }
        },
        openNotesForm: function (index, id) {
            // Loop through Notesets to reset currentlyNoteEdit
            Object.keys(this.noteset).forEach(function (value) {
                this.noteset[value].currentlyNoteEdit = 0;
            }.bind(this));

            this.globalNoteEdit = this.noteset[id].notesID;
            this.noteset[id].currentlyNoteEdit = index;
            this.noteset[id].noteText = this.noteset[id].data[index];
        },
        getNotes: function () {
            axios.get(this.getAPIURL() + '/get.php?mode=3&id=' + this.$root.dashboardID + '&user=' + this.$root.userID)
            .then((response) => {
                var $notesetToPush = [];
                Object.keys(response.data.notes).forEach(function (value) {
                    var currNote = response.data.notes[value];
                    
                    var masked = currNote.notes.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    var unmasked = JSON.parse(masked);
                    Object.keys(unmasked).forEach(function (value) {
                        var find = '<br>';
                        var re = new RegExp(find, 'g');
                        unmasked[value] = unmasked[value].replace(re, '\r\n');
                    });
                    $notesetToPush.push({
                        notesID: currNote.ID,
                        name: currNote.name,
                        data: unmasked,
                        allowEdit: true,
                        currentlyNoteEdit: 0,
                        noteText: '',
                        visible: Number(currNote.visible),
                        style: {
                            'background-color': '#' + currNote.color
                        }
                    });
                });
                this.noteset = $notesetToPush;
            })
            .catch(function (error) {
                console.log("ERROR - Get Notes. Message:");
                console.log(error);
            });
        },
        getDocument: function () {
            axios.get(this.getAPIURL() + '/get.php?mode=4&id=' + this.$route.params.id)
            .then((response) => {
                this.url = response.data.presentations[0].filePath;
            })
            .catch(function (error) {
                console.log("ERROR - Get Presentation. Message:");
                console.log(error);
            });
        },
        inputNotes: function (e) {
            if (e.keyCode === 13 && !e.shiftKey) {
                var id = e.srcElement.attributes['note-set-id'].nodeValue;
                e.preventDefault();
                this.noteset[id].data[this.noteset[id].currentlyNoteEdit] = this.noteset[id].noteText;
                this.noteset[id].currentlyNoteEdit = 0;
                this.globalNoteEdit = 0;
                this.backupNotes(id);
              }
        },
        backupNotes: function (id) {
            const params = new URLSearchParams();
            params.append('notesID', this.noteset[id].notesID);
            params.append('notes', JSON.stringify(this.noteset[id].data));
            params.append('mode', 2);
            axios.post(this.getAPIURL() + '/update.php', params)
            .catch(function (error) {
                console.log("ERROR - Backup Notes. Message:");
                console.log(error);
            });
        },
        renderPDF: function () {
            // Get PDF-object
            pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

            pdfjsLib.getDocument(this.url).promise.then(function(pdf) {
                //Loope alle Seiten
                for (var pageCount = 0; pageCount < pdf.numPages; pageCount++) {
                    pdf.getPage(pageCount + 1).then(function(page) {        
                        var scale = 1;
                        var viewport = page.getViewport(scale);

                        /*page.getTextContent().then(function (textdata) {

                            //console.log(textdata);
                        });*/

                        var canvas = document.getElementById('page-' + page.pageNumber);
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.then(function () {                        
                            /*page.getAnnotations().then(function(annotationsData) {

                                if (annotationsData.length != 0) {
                                    annotationsData.forEach(element => {
                                        if(element.subtype == "Link"){
                                            $('#ann-page-' + page.pageNumber).append("asdf")
                                        }
                                    });
                                }
                                
                            });*/
                        });

                    }, function (data) {
                        console.log(data);
                    });
                }
            }, function (reason) {
                // PDF loading error
                console.error(reason);
            });
        },
        changed: function() {
            var that = this
            this.suggestions = []
            axios.get(this.getAPIURL() + '/get.php?mode=5&query=' + this.value)
                .then(function(response) {
                    response.data.user.forEach(function(a) {
                        that.suggestions.push(a)
                    })
                }).catch(function (fault) {
                })
        },
        shareNotes: function() {
            axios.get(this.getAPIURL() + '/get.php?mode=5&query=' + this.value)
            .then(function(response) {
                console.log(response);
                if (response.data.message == undefined && value != '') {
                    alert("gut!");
                } else {
                    alert("falsch");
                }
            })
        }
    },
    watch: {
        'pdf.pdfObject': function () {
            this.pdf.totalPages = this.pdf.pdfObject.numPages;
            this.renderPages = true;
            //this.scrollPos();
            this.renderPDF();
        },
        url: function () {
            // Speichere das PDF-Objekt
            pdfjsLib.getDocument(this.url).then((pdf) => {this.pdf.pdfObject = pdf;});
        }
    },
    computed: {
        computedNoteset: function () {
            var $newNoteset = [];
            
            Object.keys(this.noteset).forEach(function (value) {
                if (this.noteset[value].visible == 1) {
                    $newNoteset.push(this.noteset[value]);
                }
            }.bind(this));
            return $newNoteset;
        }
    },
    components: {
        'vue-instant': VueInstant.VueInstant
    },
    template: `
    <div class="container">
        <div class="row head-row">
            <div class="col-9">
                <a href="" style="color:#000000;"><span class="title">IMDash ({{ $route.params.id }})</span></a>
            </div>
            <div class="col-3">
            </div>
        </div>
        <div class="row">
            <hr>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="panel tile-border--black">
                    <div class="panel-head">
                        Presentation
                    </div>
                    <div class="panel-body-pdf">
                        <div class="panel-menu">
                            <button class="toggleFullscreen" v-on:click="toggleFullscreen"><i class="material-icons">fullscreen</i></button> | 
                            Seite {{ pdf.currentPage }} / {{ pdf.totalPages }} | 
                            <button v-tippy="{ html : '#share-notes', reactive : true, interactive : true, placement : 'bottom', theme: 'light', trigger: 'click' }"><i class="material-icons">share</i></button>

                            <div id="share-notes" x-placement="bottom">
                                <div class="share-notes-modal">
                                    <h3> Notizensätze</h3>
                                    <div v-for="noteSetName in noteset">
                                        <p>
                                            Set: <b>{{ noteSetName.name }}</b>
                                            <button v-if="noteSetName.visible === 0" @click="noteSetName.visible = 1">anzeigen</button>
                                            <button v-else @click="noteSetName.visible = 0">verbergen</button>
                                            <button v-tippy="{ html : '#sendToUser{{noteSetName.noteID}}', reactive : true, interactive : true, placement : 'bottom', theme: 'light', trigger: 'click' }">Senden</button>
                                            
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div :id="['sendToUser' + noteSetName.noteID]" x-placement="bottom" v-for="noteSetName in noteset">
                                <div class="share-notes-name-dialog">
                                        <vue-instant :suggestion-attribute="suggestionAttribute" 
                                        v-model="value" 
                                        :disabled="false" 
                                        @input="changed" 
                                        @click-button="shareNotes"
                                        :show-autocomplete="true"
                                        :autofocus="false" 
                                        :suggestions="suggestions" 
                                        name="customName" 
                                        placeholder="Name eingeben" 
                                        type="google"></vue-instant>
                                </div>
                            </div>


                        </div>
                        <div class="panel-statusbar">
                            <div class="panel-statusbar-progress"></div>
                        </div>
                        <div id="panel-pdf-view-id" v-on:scroll="scrollPos">

                            <div v-if="loading"> lade!</div>
                            
                            <div class="reihe" v-for="pageID in pdf.totalPages" v-if="renderPages">

                                <div class="pdf-page-wrapper">
                                    <canvas :id="['page-' + pageID]" class="pdf-viewer-page"></canvas>
                                </div>
                                <div :id="['note-slide-' + pageID]" class="panel-notes-note">
                                    <h1>Seite {{ pageID }}</h1>
                                    <div v-for="(satz, id) in computedNoteset"
                                        v-on:click="openNotesForm(pageID, id)" 
                                        class="text-area-preview" 
                                        :style="satz.style"
                                        :id="['note-page-' + pageID]"><small>{{satz.name}}</small><span v-if="satz.currentlyNoteEdit !== pageID || satz.notesID !== globalNoteEdit">
                                                <p v-if="satz.data[pageID]">{{ satz.data[pageID] }}</p>
                                                <p v-else>{{ standardNoteText }}</p>
                                            </span><form id="notesForm" class="notes-form" action="" v-if="satz.currentlyNoteEdit === pageID && satz.notesID === globalNoteEdit">
                                                <textarea rows="8" @keydown="inputNotes" :note-set-id="id" class="note-input-text" v-model="satz.noteText" v-focus></textarea>
                                            </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});