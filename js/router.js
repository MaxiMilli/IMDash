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
        component: 'presentation-view'
    },
    { 
        path: '/exercise', 
        component: 'exercise-overview'
    },
    {
        path: '/exercise/solve/:id',
        component: 'exercise-solve'
    },
    {
        path: '/search/:searchterm',
        component: 'search-view'
    }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
})
