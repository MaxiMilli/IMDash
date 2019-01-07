Vue.component('exercise-pagination', {
    props: {
        listData: {
            type: Array,
            required: true
        },
        categoryList: {
            type: Array,
            required: true
        },
        size: {
            type: Number,
            required: false,
            default: 10
        }
    },
    data: function () {
        return {
            pageNumber: 0,
            pageCountNumber: 0
        }
    },
    mounted: function () {
        let l = this.listData.length + 1, s = this.size;
        this.pageCountNumber = Math.floor(l/s);
    },
    methods: {
        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        },
        setPage(number) {
            this.pageNumber = number;
        },
        getCategoryColor: function (categoryID) {
            var colo = "";
            this.categoryList.forEach((cat, key) => {
                if (cat.ID === categoryID) {
                    colo = this.categoryList[key].color;
                }
            });

            return colo;
        },
        activeNumber(page) {
            if (page === this.pageNumber) {
                return {
                    'background-color': '#dddddd'
                }
            }
        }
    },
    computed: {
        paginatedData() {
            const start = this.pageNumber * this.size,
                end = start + this.size;

            return this.listData.slice(start, end);
        }
    },
    watch: {
        listData: function () {
            let l = this.listData.length + 1,
                s = this.size;
            this.pageCountNumber = Math.floor(l / s);
            if (this.pageCountNumber == 0) {
                this.pageCountNumber = 1;
            }
        },
    },
    template: `
    <div class="row">
        <div class="tile-exercise-pagination">
            <button @click="prevPage" class="btn" :disabled="pageNumber==0">
                <i class="material-icons float-right">arrow_backward</i>
            </button>

            <button v-for="page in pageCountNumber" @click="setPage(page - 1)" class="btn" :style="activeNumber(page - 1)">
                {{page}}
            </button>

            <button @click="nextPage" class="btn" :disabled="pageNumber >= pageCountNumber -1">
                <i class="material-icons float-right">arrow_forward</i>
            </button>
        </div>
        <div v-for="exercise in paginatedData" class="tile-exercise-featured tile-border--black">
            <div class="tile-excercise-marker" :style="{ 'background-color': getCategoryColor(exercise.category)}">
                <i class="material-icons float-right">arrow_forward</i>
            </div>
            <div class=" tile-exercise-name">
                <p>{{ exercise.name }}</p>
            </div>
            <div class=" tile-excercise-semester">
                <p>Sem {{ exercise.grade }}</p>
            </div>
            <div class=" tile-excercise-level">
                <p>Level {{ exercise.level }}</p>
            </div>
            <router-link class="btn tile-exercise-button" :to="{ path: '/exercise/solve/' + exercise.ID}" :style="{ 'background-color': getCategoryColor(exercise.category)}">
                <p>Übung lösen</p>
            </router-link>
        </div>

        <div class="tile-exercise-pagination">
            <button @click="prevPage" class="btn" :disabled="pageNumber == 0">
            <i class="material-icons float-right">arrow_backward</i>
            </button>

            <button v-for="page in pageCountNumber" @click="setPage(page - 1)" class="btn" :style="activeNumber(page - 1)">
                {{page}}
            </button>

            <button @click="nextPage" class="btn" :disabled="pageNumber >= pageCountNumber -1">
            <i class="material-icons float-right">arrow_forward</i>
            </button>
        </div>
    </div>
    `
});
