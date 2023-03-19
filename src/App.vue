<script setup lang="ts">
import {
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, computed } from 'vue';
import { Delta } from '@vueup/vue-quill'
import { useDocument, useFirestore } from 'vuefire';
// import BlotFormatter from 'quill-blot-formatter'

// const modules = {
//   name: 'blotFormatter',
//   module: BlotFormatter,
//   options: {
//     /* options */
//   },
// }

const contentDelta = ref<Delta>(
  new Delta([
    { insert: 'Gandalf', attributes: { bold: true } },
    { insert: ' the ' },
    { insert: 'Grey', attributes: { color: '#ccc' } },
  ])
)
const contentHTML = ref('<h1>This is html header</h1>')
const contentText = ref('This is just plain text')

const props = defineProps({
  today: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
})

const db = useFirestore()
// this could just be `doc(db, 'count', props.today)` but that wouldn't react to changes
const todaysCountDoc = computed(() =>
  doc(db, 'count', props.today).withConverter<{ when: Timestamp; n: number }>({
    fromFirestore: (snapshot) => {
      // Here you could do validation with a library like zod
      return snapshot.data(
        // this avoids having `null` while the server timestamp is updating
        { serverTimestamps: 'estimate' }
      ) as any
    },
    toFirestore: (data) => data,
  })
)

const { data: count, pending } = useDocument(todaysCountDoc)

function incrementCount() {
  console.log('todaysCountDoc', todaysCountDoc)
  if (count.value) {
    return updateDoc(todaysCountDoc.value, {
      // increment is a special value that enables increments
      n: increment(1),
      // serverTimestamp is a special value that sets the current time
      when: serverTimestamp(),
    })
  } else {
    return setDoc(todaysCountDoc.value, {
      n: 0,
      when: serverTimestamp(),
    })
  }
}
</script>

<template>
  <p v-if="pending">Loading...</p>
  <p v-else>Ready !!</p>

  <!-- <QuillEditor v-model:content="contentDelta" theme="snow" /> -->

  <h2>Delta</h2>
  <QuillEditor v-model:content="contentDelta" contentType="delta" toolbar="full" />
  <!-- <QuillEditor v-model:content="contentDelta" contentType="delta" :modules="modules" toolbar="full" /> -->
  <pre v-highlightjs><code class="json">{{contentDelta}}</code> tpyeof :: {{ typeof contentDelta }}</pre>
  <br />
  <h2>HTML</h2>
  <QuillEditor v-model:content="contentHTML" contentType="html" toolbar="full" />
  <pre v-highlightjs><code class="json">{{contentHTML}}</code> tpyeof :: {{ typeof contentHTML }}</pre>
  <br />
  <h2>Plain Text</h2>
  <QuillEditor v-model:content="contentText" contentType="text" toolbar="full" />
  <pre v-highlightjs><code class="json">{{contentText}}</code></pre>
  <br />

  <!-- <div>
  contentDelta:: {{ contentDelta }}
  </div>
  <div>
  contentHTML:: {{ contentHTML }}
  </div>
  <div>
  contentText:: {{ contentText }}
  </div> -->

  <div>count is {{ count.n }}</div>
  <button @click="incrementCount">
    increment
  </button>
  <p v-if="count">Last increment: {{ count.when }}</p>
</template>

<style scoped>
</style>
