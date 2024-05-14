
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBOx2B59WIKRa6XULQk0ZCjg9yshXTqpkE",
  authDomain: "invoiceit-c4d60.firebaseapp.com",
  projectId: "invoiceit-c4d60",
  storageBucket: "invoiceit-c4d60.appspot.com",
  messagingSenderId: "69759863027",
  appId: "1:69759863027:web:f3c0751ad59619d71fcf86"
};


const app = initializeApp(firebaseConfig);

// Get the authentication service from the initialized app
const auth = getAuth(app);

export { auth, app }