Vue.component('presentation-view', {
    data: function () {
        return {
            url: './upload/Intro_IM_V_HS2018.pdf',
        }
    },
    mixins: [
        mixinAPI
    ],
    mounted: function () {
        this.$root.viewModal = false;
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        var loadingTask = pdfjsLib.getDocument(this.url);
        loadingTask.promise.then(function(pdf) {
            console.log('PDF loaded');
            var pageCount;
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
                    
                    $('#note-slide-' + page.pageNumber).html('<p>Seite ' + page.pageNumber + '</p><div class="text-area" id="note-page-' + page.pageNumber + '" pageID="' + page.pageNumber + '">' + stdValueNotes + '</div>');
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
            <div class="col-12" id="app">
                <div class="panel tile-border--black">
                    <div class="panel-head">
                        Presentation
                    </div>
                    <div class="panel-body-pdf">
                        <div class="panel-menu">
                            <a href="#" class="toggleFullscreen"><i class="material-icons">fullscreen</i></a> | <i class="pages"></i>
                        </div>
                        <div class="panel-statusbar">
                            <div class="panel-statusbar-progress"></div>
                        </div>
                        <div id="panel-pdf-view-id"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});