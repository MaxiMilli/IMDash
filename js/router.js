// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [{
        path: '/:id',
        component: 'dashboard-view',
        name: 'home'
        /*children: [{
            path: '/modal',
            compoent: 'modal-component'
        }]*/
    },
    {
        path: '/presentation/:id',
        component: 'presentation-view',
        name: 'presentation'
    },
    { 
        path: '/exercises/overview', 
        component: 'exercise-overview',
        name: 'exercise'
    },
    {
        path: '/exercise/solve/:id',
        component: 'exercise-solve',
        name: 'exercise-solve'
    },
    {
        path: '/exercise/rating/:id',
        component: 'exercise-rating',
        name: 'exercise-rating'
    },
    {
        path: '/search/:searchterm',
        component: 'search-view',
        name: 'search'
    }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
})
