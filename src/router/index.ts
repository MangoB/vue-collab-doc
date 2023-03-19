import { getCurrentUser } from 'vuefire'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged } from "firebase/auth";


const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Home Page',
    meta: {
      requiresAuth: true,
    },
    component: () => import('../views/HomePage/index.vue'),
  },
  {
    path: '/edit/:id',
    name: 'Edit Page',
    meta: {
      requiresAuth: true,
    },
    component: () => import('../views/EditPage/index.vue'),
  },
  {
    path: '/login',
    name: 'Login Page',
    component: () => import('../views/LoginPage/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(`${import.meta.env.BASE_URL}`),
  routes,
})

router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser()
  // if the user is not logged in, redirect to the login page
  const auth = await getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
    console.log('beforeEach onAuthStateChanged', user.displayName)
    } else {
      // User is signed out
      // ...
    }
  })
  console.log('beforeEach currentUser', currentUser?.displayName)
  // console.log('!currentUser.value', !currentUser.value)
  console.log('to.meta.requiresAuth', to.meta.requiresAuth)
  // console.log('beforeEach displayName', currentUser?.value?.displayName)
  if (to.meta.requiresAuth && !currentUser) {
    return { name: 'Login Page' }
  }
  return true
})

export default router
