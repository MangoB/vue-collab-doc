<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import {
  DeltaOperation,
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  Quill,
} from 'quill'
import { useCurrentUser, useDocument, useFirestore } from 'vuefire'

import QuillCursors from 'quill-cursors';
import { collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { uuid } from 'vue-uuid';
import randomColor from 'randomcolor';

const route = useRoute()
const id = route.params.id as string
const db = useFirestore()
const documentRef = doc(
  collection(db, 'documents'), id
)
const document = useDocument(documentRef)
const user = useCurrentUser()

const cursorUuid = uuid.v4()
const modules = {
  name: 'cursors',  
  module: QuillCursors, 
  options: {
  }
}

const editor = ref(null)
let OldCursorData = ref({})

const content = computed(() => {
  const quill = editor.value?.getQuill();
  const cursorsModule = quill?.getModule('cursors');

  for (const [key, value] of Object.entries(document.value?.cursor || {})) {
    if (!OldCursorData.value?.[key]) {
      cursorsModule.createCursor(key, value?.name || 'Anonymous', randomColor());
    }
    if (key !== cursorUuid && value?.range) {
      cursorsModule.moveCursor(key, value.range)
    }
    delete OldCursorData.value[key]
  }

  for (const [key, value] of Object.entries(OldCursorData.value || {})) {
    cursorsModule.removeCursor(key)
    delete OldCursorData.value[key]
  }

  OldCursorData.value = {
    ...(document.value?.cursor || {})
  }
  return document.value?.content || ''
})

// const newCursor = computed(() => {
//   console.log('newCursor')
//   return document.value?.cursor || {}
// })

const displayName = computed(() => {
  return user.value?.displayName || 'Anonymous'
})

// watch(document, (newCursor) => {
//   console.log('newCursor is', newCursor)
// })

onMounted(async () => {
  window.addEventListener("beforeunload", deleteTab, true);
  
  // console.log('editor', editor)
  // const quill = editor.value.getQuill();
  // // console.log('quill', quill)
  // // const cursors = quill.getModule('cursors')
  // const cursorsModule = quill.getModule('cursors');
  // const getCursorsModule = () => cursorsModule;
  // cursorsModule.registerTextChangeListener();
  // console.log('cursors', cursors)
  // cursorsModule.setCursor({
  //   id: cursorUuid,
  //   name: 'yok',
  //   color: 'red',
  //   range: {
  //     index: 0,
  //     length: 5,
  //   }
  // })
  // Object.keys(document.value?.cursor)
  // cursorsModule.createCursor('cursor', 'User 1', randomColor());
  // cursorsModule.moveCursor('cursor', {
  //   index: 0,
  //   length: 5,
  // })
// const cursorsTwo = quillTwo.getModule('cursors');

// cursorsOne.createCursor('cursor', 'User 2', 'blue');
// cursorsTwo.createCursor('cursor', 'User 1', 'red');
})
onBeforeUnmount(async () => {
  window.removeEventListener("beforeunload", deleteTab, true);
  deleteTab()
})

// async function textChange (data: TextChangeHandler) {
//   console.log('textChange -----------------------------')
//   console.log('data', data)
//   console.log('----------------------------------------')
// }
async function deleteTab() {
  let cursorData = document.value?.cursor || {}
  delete cursorData[cursorUuid]

  await updateDoc(documentRef, {
    // name: displayName,
    cursor: cursorData,
  });
}

async function selectionChange (data: SelectionChangeHandler) {
  let cursorData = document.value?.cursor || {}
  if (data.range)
  cursorData[cursorUuid] = { 
    name: displayName,
    range: {
      ...data.range
    },
  }
  else delete cursorData[cursorUuid]

  // console.log('selectionChange -----------------------------')
  // console.log('cursorData', cursorData)
  await updateDoc(documentRef, {
    cursor: cursorData,
  });
  // console.log('----------------------------------------')
}

// function editorChange (data: EditorChangeHandler) {
//   console.log('editorChange -----------------------------')
//   console.log('data', data)
//   // if (data.name === 'text-change') {
//   //   await updateDoc(documentRef, {
//   //     capital: true
//   //   });
//   // }
//   console.log('----------------------------------------')
// }

async function updateContent (content: DeltaOperation) {
  // console.log('updateContent -----------------------------')
  // console.log('content', content)
  await updateDoc(documentRef, {
    content,
    updated_at: serverTimestamp(),
  });
  // console.log('----------------------------------------')
}

// function focus (data: Ref<Element>) {
//   console.log('focus -----------------------------')
//   console.log('data', data)
// }

// function blur (data: Ref<Element>) {
//   console.log('blur -----------------------------')
//   console.log('data', data)
//   console.log('----------------------------------------')
// }

// function ready (data: Quill) {
//   console.log('ready -----------------------------')
//   console.log('data', data)
//   console.log('----------------------------------------')
// }
</script>

<template>
  <QuillEditor
    ref="editor"
    contentType="html"
    toolbar="full"
    :content="content"
    :modules="modules"
    @selectionChange="selectionChange"
    @update:content="updateContent"
  />

    <!-- @editorChange="editorChange" -->
    <!-- @textChange="textChange" -->
  <!--
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
</style>
