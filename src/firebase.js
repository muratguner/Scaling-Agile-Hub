import firebase from "firebase";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCW7Ktq7P2jwWy4KDZVLIWu3CwZW6ermYw",
  authDomain: "scaling-agile-hub.firebaseapp.com",
  databaseURL: "https://scaling-agile-hub.firebaseio.com",
  projectId: "scaling-agile-hub",
  storageBucket: "scaling-agile-hub.appspot.com",
  messagingSenderId: "210803525808",
  appId: "1:210803525808:web:41ad643ab7a312f0069375",
  measurementId: "G-07FGRX8VZJ",
};

// Check that `window` is in scope for the analytics module!
if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // To enable analytics. https://firebase.google.com/docs/analytics/get-started
  if ("measurementId" in firebaseConfig) firebase.analytics();
  // firebase.analytics().logEvent("test_data");
}

export default firebase;
