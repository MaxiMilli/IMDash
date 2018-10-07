Vue.component('presentation-view', {
    data: function () {
        return {
            url: './upload/Intro_IM_V_HS2018.pdf',
            loading: false, // TODO: loading zum laufen bringen.
            fullscreenIsActive: false,
            currentPage: 0,
            totalPages: 0,
            renderPages: false,
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.$root.viewModal = false;
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        pdfjsLib.getDocument(this.url).promise.then(function(pdf) {
            console.log('PDF loaded');
            var pageCount;
            this.loading = false;
            this.totalPages = pdf.numPages;
            this.renderPages = true;
            for (pageCount = 0; pageCount < pdf.numPages; pageCount++) {
                var realPageNumber = pageCount + 1;
                //console.log('PDF FOR Loop started');
                //console.log(realPageNumber);

                $('#panel-pdf-view-id').append($('<canvas/>', {'id': 'page-' + realPageNumber, 'class': 'pdf-viewer-page'}));
                $('#panel-pdf-view-id').append($('<div/>', {'id': 'note-slide-' + realPageNumber, 'class': 'panel-notes-note'}));

                pdf.getPage(realPageNumber).then(function(page) {   
                    //console.log('PDF page ' + page.pageNumber + ' rendered');         
                    var scale = 1;
                    var viewport = page.getViewport(scale);

                    var stdValueNotes = "Text mit einem Klick hinzufügen...";
                    
                    $('#note-slide-' + page.pageNumber).html('<p>Seite ' + page.pageNumber + '</p><div v-on:click="openNotesForm" class="text-area" id="note-page-' + page.pageNumber + '" pageID="' + page.pageNumber + '">' + stdValueNotes + '</div>');
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
                    });
                }).then(function (reason) {
                    $('.pages').text("Seite 1/" + pdf.numPages);
                });
            }
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
    },
    methods: {
        toggleAddTile: function () {
            this.viewFunctions.addTile = !this.viewFunctions.addTile;
        },
        toggleFullscreen: function () {
            //console.log($('body .panel-body-pdf'));
            //console.log($('.panel-body-pdf'));
            if (this.fullscreenIsActive == false) {
                this.fullscreenIsActive = true;
                $('body').prepend($('.panel-body'));
                $('.panel-body-pdf').addClass('fullscreen');
            } else {
                this.fullscreenIsActive = false;
                $('.panel-head').after($('.panel-body'));
                $('.panel-body-pdf').removeClass('fullscreen');
            }
        },
        scrollPos: function () {
            var div = $('.pdf-viewer-page').offset().top - $('#panel-pdf-view-id').offset().top;
            var progress = (div / $('#panel-pdf-view-id')[0].scrollHeight) * 100;
            $('.panel-statusbar-progress').width(progress * -1 + "%");  
            
            var $pages = 0;
            var $totalPages = 0;
            $('.pdf-viewer-page').each(function (key, element) {
                //console.log($('#panel-pdf-view-id').scrollTop() + " >= " + ($('.pdf-viewer-page')[key].offsetTop - 10 - $('#panel-pdf-view-id')[0].offsetTop));
                if ($('#panel-pdf-view-id').scrollTop() >= $('.pdf-viewer-page')[key].offsetTop - 10 - $('#panel-pdf-view-id')[0].offsetTop) {
                    $pages++;
                }
                $totalPages++;
            });

            if (this.currentPage != $pages) {
                $('.pages').text("Seite " + $pages + "/" + $totalPages);

                this.currentPage = $pages;
            }
        },
        openNotesForm: function (element, page) {
            console.log($(element));
            //$(element).append('hallo');
        
            if ($(element).find('#note').length == 0){
                $('#text-' + page).hide();
                $form = $('<form id="form-' + page + '" action="#"></form>');
                $form.append('<input type="text" id="note" value="Notizen">');
                $form.append('<input type="submit" id="saveNote-' + page + '" value="button">');
                $(element).append($form);
                $('#note-slide-' + page).unbind('click');
                $('#form-' + page).on('submit', function () {
                    alert("submi!");
                });
            }
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
                            <button class="toggleFullscreen" v-on:click="toggleFullscreen"><i class="material-icons">fullscreen</i></button> | <i class="pages"></i>
                        </div>
                        <div class="panel-statusbar">
                            <div class="panel-statusbar-progress"></div>
                        </div>
                        <div id="panel-pdf-view-id" v-on:scroll="scrollPos">

                            <div v-if="loading"> lade!</div>
                            
                            <div class="row" v-for="pageID in totalPages" v-if="renderPages">
                            
                                <canvas id="['page-', pageID]" class="pdf-viewer-page"></canvas>
                                <div id="['note-slide-', pageID]" class="panel-notes-note"></div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});