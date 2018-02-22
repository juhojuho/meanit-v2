import Vue from 'vue';
import Router from 'vue-router';
import VueAnalytics from 'vue-analytics';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Users from '@/pages/Users';
import Help from '@/pages/Help';
import Home from '../pages/Home';
import Seemore from '../pages/Seemore';
import Add from '../pages/Add';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Mypage from '../pages/Mypage';
import NotFound from '../pages/NotFound';
import Report from '../pages/Report';
import More from '../pages/More';
import Alarm from '../pages/Alarms';
import Loading from '../pages/Loading';
import Post from '../pages/Post';
import Glossary from '../pages/Glossary';
import Collection from '../pages/Collection';
import Collections from '../pages/Collections';

Vue.use(Router);
Vue.use(VueAwesomeSwiper);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/it/:name/',
      name: 'Seemore',
      component: Seemore,
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/mypage/:uid',
      name: 'Mypage',
      component: Mypage,
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/it/:it/report/:pid',
      name: 'Report',
      component: Report,
    },
    {
      path: '/more',
      name: 'More',
      component: More,
    },
    {
      path: '/alarm/:uid',
      name: 'Alarm',
      component: Alarm,
    },
    {
      path: '/loading',
      name: 'Loading',
      component: Loading,
    },
    {
      path: '/post/:it/:pid',
      name: 'Post',
      component: Post,
    },
    {
      path: '/glossary',
      name: 'Glossary',
      component: Glossary,
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/help',
      name: 'Help',
      component: Help,
    },
    {
      path: '/collection',
      name: 'Collection',
      component: Collection,
    },
    {
      path: '/collections',
      name: 'Collections',
      component: Collections,
    }
  ],
});

Vue.use(VueAnalytics, {
  id: 'UA-111631954-1',
  router,
});

export default router;
