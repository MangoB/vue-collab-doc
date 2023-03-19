import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// export const firebaseApp = initializeApp({
//     apiKey: 'AIzaSyDyjJeqXsmmSldQL6AO9FlDWQqCYq16tl8',
//     authDomain: 'vitesse-vuefire-example.firebaseapp.com',
//     databaseURL:
//       'https://vitesse-vuefire-example-default-rtdb.europe-west1.firebasedatabase.app',
//     projectId: 'vitesse-vuefire-example',
//     appId: '1:682870035896:web:8bac46c2357e0bd147eb4d',
// })

const firebaseConfig = {
  apiKey: "AIzaSyBuQNgz5SmxHDeJzHwpBL777XIuibfRKrI",
  authDomain: "vuecollabdocs.firebaseapp.com",
  projectId: "vuecollabdocs",
  storageBucket: "vuecollabdocs.appspot.com",
  messagingSenderId: "269667520158",
  appId: "1:269667520158:web:ab78d175bb81e0caff358f",
  measurementId: "G-7H23QGCYZF"
};

// export const firebaseApp = initializeApp(firebaseConfig)

// // used for the firestore refs
// const db = getFirestore(firebaseApp)

// // here we can export reusable database references
// export const todosRef = collection(db, 'documents')


const firebaseApp = initializeApp(firebaseConfig)

// used for the firestore refs
const db = getFirestore(firebaseApp)

// here we can export reusable database references
const todosRef = collection(db, 'documents')

//initialize firebase auth
const auth = getAuth()


export { firebaseApp, auth, todosRef }