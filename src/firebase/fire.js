import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDRd_g-LsEexqf9hQ6Whzn-2-A-kJ9g5a0',
  authDomain: 'besttile-a546b.firebaseapp.com',
  databaseURL: 'https://besttile-a546b.firebaseio.com',
  projectId: 'besttile-a546b',
  storageBucket: 'besttile-a546b.appspot.com',
  messagingSenderId: '1078132894694',
  appId: '1:1078132894694:web:11276df8c9c60586d7c427',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rdb = getDatabase(app);

export { rdb };
