/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-19 17:30:21
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 17:42:33
 */
import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'about',
		redirct:'/index'
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
	},
	
	{
		path: '/article',
		name:'文章',
		component: () => import('../views/Article.vue'),
	},
	{
		path: '/index',
		name:'文章',
		component: () => import('../views/Index.vue'),
	},
	{
		path: '/detail',
		name:'文章详情',
		component: () => import('../views/Detail.vue'),
	},
]

const router = new VueRouter({
	routes
})

export default router
