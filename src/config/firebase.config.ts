import { getApp,getApps,initializeApp } from 'firebase/app'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
apiKey: import.meta.env.VITE_FIRRBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIRRBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIRRBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIRRBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIRRBASE_MESSAGING_SENDER_ID,
  appId:import.meta.env.VITE_FIRRBASE_MESSAGING_APP_ID
}

const app= getApps.length>0  ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}