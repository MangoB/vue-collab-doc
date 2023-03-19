<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { Delta } from '@vueup/vue-quill'

import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import { getAuth, signOut } from "firebase/auth";

const router = useRouter()
const user = useCurrentUser()
const db = useFirestore()
const documents = useCollection(collection(db, 'documents'))

// const headers = [
//   {
//     title: 'Name',
//     value: 'name',
//   },
//   {
//     title: 'Author',
//     value: 'created_by',
//   },
//   {
//     title: 'Updated',
//     value: 'updated_at',
//   },
//   {
//     title: '',
//     value: 'action',
//   },
// ]

function logout() {
let auth = getAuth();
  signOut(auth)
    .then(async (result: any) => {
      console.log('result', result)
    })
    .catch((err: any) => {
      console.log('err', err);
    });
}

function openDocumentByID(id: string, event: { target: HTMLInputElement }) {
  if (event.target.nodeName !== 'I') {
      router.push(`/edit/${id}`)
  }
}

function deleteDocument(id: string) {
  console.log('Delete : ', id)
}

</script>

<template>
  <button @click="logout">Logout</button>
  <p v-if="user">Hello {{ user.displayName }}</p>
  <p v-else>Hello Anonymous</p>
  <!-- <QuillEditor v-model:content="contentDelta" theme="snow" /> -->

  <v-table theme="dark">
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Author
        </th>
        <th class="text-left">
          Updated
        </th>
        <th colspan="2" />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="documentsItem in documents"
        class="cursor-pointer"
        :key="documentsItem.name"
        @click="openDocumentByID(documentsItem.id, $event)"
      >
        <td>{{ documentsItem.name }}</td>
        <td>{{ documentsItem.created_by }}</td>
        <td>{{ documentsItem.updated_at }}</td>
        <td>
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
            <v-btn 
              v-bind="props"
              icon="mdi-dots-vertical"
              variant="text"
              color="white"
            >
            </v-btn>
            </template>

            <v-list>
              <v-list-item
                title="Delete"
                @click="deleteDocument(documentsItem.id)"
              >
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!--
  <QuillEditor v-model:content="contentDelta" contentType="delta" toolbar="full" />
  <QuillEditor v-model:content="contentDelta" contentType="delta" :modules="modules" toolbar="full" />

  <pre v-highlightjs><code class="json">{{contentDelta}}</code> tpyeof :: {{ typeof contentDelta }}</pre>
  <br />
  <h2>HTML</h2>
  <QuillEditor v-model:content="contentHTML" contentType="html" toolbar="full" />
  <pre v-highlightjs><code class="json">{{contentHTML}}</code> tpyeof :: {{ typeof contentHTML }}</pre>
  <br />
  <h2>Plain Text</h2>
  <QuillEditor v-model:content="contentText" contentType="text" toolbar="full" />
  <pre v-highlightjs><code class="json">{{contentText}}</code></pre>
  <br /> -->

</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
