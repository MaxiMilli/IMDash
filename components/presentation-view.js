Vue.component('presentation-view', {
    data: function () {
        return {
            url: './upload/Intro_IM_V_HS2018.pdf',
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
        this.$root.viewModal = false;
        // Get PDF-object
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        pdfjsLib.getDocument(this.url).then((pdf) => {this.pdf.pdfObject = pdf;});
        this.renderPages = true;
        pdfjsLib.getDocument(this.url).promise.then(function(pdf) {
            //console.log('PDF loaded');
            //console.log(pdf);
            var pageCount;
            for (pageCount = 0; pageCount < pdf.numPages; pageCount++) {
                var realPageNumber = pageCount + 1;
                //console.log('PDF FOR Loop started');
                //console.log(realPageNumber);

                ///$('#panel-pdf-view-id').append($('<canvas/>', {'id': 'page-' + realPageNumber, 'class': 'pdf-viewer-page'}));
                //$('#panel-pdf-view-id').append($('<div/>', {'id': 'note-slide-' + realPageNumber, 'class': 'panel-notes-note'}));

                pdf.getPage(realPageNumber).then(function(page) {   
                    //console.log('PDF page ' + page.pageNumber + ' rendered');         
                    var scale = 1;
                    var viewport = page.getViewport(scale);
                    
                    page.getTextContent().then(function (textdata) {

                        //console.log(textdata);
                    });

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
                    //setupAnnotations(page, viewport, canvas, $('.annotationLayer'));
                    renderTask.then(function () {
                        //console.log('Page rendered');
                        
                        /*page.getAnnotations().then(function(annotationsData) {

                            if (annotationsData.length != 0) {
                                annotationsData.forEach(element => {
                                    if(element.subtype == "Link"){
                                        $('#ann-page-' + page.pageNumber).append("asdf")
                                    }
                                });
                            }
                            
                        });*/
                        this.loading = false;
                    }).then(function(error) {
                        console.log(error);
                    });

                }, function (data) {
                    console.log("asdf");
                    console.log(data);
                }).then(function (reason) {
                    console.log(reason);
                });
            }
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
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
            //alert(index);
            this.currentlyNoteEdit = index;

            this.noteText = this.notes[index];
            //$(element).append('hallo');
        
            /*if ($(element).find('#note').length == 0){
                $('#text-' + page).hide();
                $form = $('<form id="form-' + page + '" action="#"></form>');
                $form.append('<input type="text" id="note" value="Notizen">');
                $form.append('<input type="submit" id="saveNote-' + page + '" value="button">');
                $(element).append($form);
                $('#note-slide-' + page).unbind('click');
                $('#form-' + page).on('submit', function () {
                    alert("submi!");
                });
            }*/
        },
        getNotes: function () {
            axios.get(this.getAPIURL() + '/get.php?mode=3&id=' + this.$root.dashboardID + '&user=' + this.$root.userID)
            .then((response) => {
                console.log(response.data.notes[0].ID)
                this.notesID = response.data.notes[0].ID;
                this.notes = JSON.parse(response.data.notes[0].notes);
            })
            .catch(function (error) {
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
            .then((response) => {
                //console.log("Notizenupdate Erfolgreich");
                //console.log(response);
            })
            .catch(function (error) {
                //console.log("Notizenupdate gescheitert");
                //console.log(error);
            });
        }
    },
    watch: {
        'pdf.pdfObject': function () {
            this.pdf.totalPages = this.pdf.pdfObject.numPages;
            //this.scrollPos();
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
                            <button class="toggleFullscreen" v-on:click="toggleFullscreen"><i class="material-icons">fullscreen</i></button> | Seite {{ pdf.currentPage }} / {{ pdf.totalPages }}
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