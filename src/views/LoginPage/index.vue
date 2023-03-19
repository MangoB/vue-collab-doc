<script setup lang="ts">
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged } from "firebase/auth";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'


const router = useRouter()

function authenticateWithGoogle() {
let provider = new GoogleAuthProvider();
let auth = getAuth();
  signInWithPopup(auth, provider)
    .then(async (result: any) => {
      console.log('result', result)
      router.push('/')
    })
    .catch((err: any) => {
      console.log('err', err);
    });
}
</script>

<template>
  <button @click="authenticateWithGoogle">Login</button>
</template>

<style scoped>
</style>
