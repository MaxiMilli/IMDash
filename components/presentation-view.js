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
            currentlyNoteEdit: 0,
            noteText: '',
            notesID: 0,
            notes: {},
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
        openNotesForm: function (index) {
            this.currentlyNoteEdit = index;
            this.noteText = this.notes[index];
        },
        getNotes: function () {
            axios.get(this.getAPIURL() + '/get.php?mode=3&id=' + this.$root.dashboardID + '&user=' + this.$root.userID)
            .then((response) => {
                this.notesID = response.data.notes[0].ID;
                this.notes = JSON.parse(response.data.notes[0].notes);
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
                console.log(response.data);
            })
            .catch(function (error) {
                console.log("ERROR - Get Presentation. Message:");
                console.log(error);
            });
        },
        inputNotes: function (e) {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                this.notes[this.currentlyNoteEdit] = this.noteText;
                this.currentlyNoteEdit = 0;
                this.backupNotes();
              }
        },
        backupNotes: function () {
            const params = new URLSearchParams();
            params.append('notesID', this.notesID);
            params.append('notes', JSON.stringify(this.notes));
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
                            <button v-tippy="{ html : '#share-notes'  , interactive : true , placement: 'bottom', theme: 'light' }"><i class="material-icons">share</i></button>

                            <div id="share-notes" x-placement="bottom">
                                <div class="share-notes-modal">
                                    <h3> Share Notes</h3>
                                    <p style="color: black"> Hallo - data binding </p>
                                    <button>Click</button>
                                </div>
                            </div>


                        </div>
                        <div class="panel-statusbar">
                            <div class="panel-statusbar-progress"></div>
                        </div>
                        <div id="panel-pdf-view-id" v-on:scroll="scrollPos">

                            <div v-if="loading"> lade!</div>
                            
                            <div class="reihe" v-for="pageID in pdf.totalPages" v-if="renderPages">
                            
                                <canvas :id="['page-' + pageID]" class="pdf-viewer-page"></canvas>
                                <div :id="['note-slide-' + pageID]" class="panel-notes-note">
                                    <h1>Seite {{ pageID }}</h1>
                                    <div v-on:click="openNotesForm(pageID)" class="text-area-preview" :id="['note-page-' + pageID]" v-if="currentlyNoteEdit !== pageID">
                                        <p v-if="notes[pageID]">{{ notes[pageID] }}</p>
                                        <p v-else>{{ standardNoteText }}</p>
                                    </div>
                                    <div class="text-area-edit" v-if="currentlyNoteEdit === pageID">
                                        <form id="notesForm" class="notes-form" action="">
                                            <textarea rows="8" @keydown="inputNotes" class="note-input-text" v-model="noteText" v-focus></textarea>
                                            
                                        </form>
                                    </div>
                                    <div class="text-area-preview">
                                        Testtext
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