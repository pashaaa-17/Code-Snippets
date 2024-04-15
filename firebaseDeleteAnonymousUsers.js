const admin = require("firebase-admin");

const serviceAccount = require("C:/Users/...../adminsdk.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/u/0/project/......",
});

// Function to delete a single user by UID
function deleteUser(uid) {
  admin.auth().deleteUser(uid)
      .then(() => {
        console.log("Successfully deleted user", uid);
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
}

// Function to recursively retrieve and delete all anonymous users
function deleteAnonymousUsers(nextPageToken) {
  admin.auth().listUsers(100, nextPageToken)
      .then((listUsersResult) => {
        // Iterate over the list of users and delete each anonymous user
        listUsersResult.users.forEach((userRecord) => {
          if (userRecord.toJSON().providerData.length === 0) {
            const uid = userRecord.toJSON().uid;
            deleteUser(uid);
          }
        });
        // If there are more users to fetch, recursively call this function with the next page token
        if (listUsersResult.pageToken) {
          deleteAnonymousUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log("Error listing users:", error);
      });
}

// Start the process by calling the function without any page token
deleteAnonymousUsers();
