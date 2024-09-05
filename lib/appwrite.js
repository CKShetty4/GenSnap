import { Account, Avatars, Client, Databases, Storage, ID, Query } from 'react-native-appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ckshetty.gensnap',
    projectId: '66cc21db00243e062ffe',
    databaseId: '66cc2474002443e52c02',
    userCollectionId: '66cc24b3000bc6c5586f',
    videoCollectionId: '66cc24e20028bc613225',
    storageId: '66cc274b0014df711a08',

}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = Config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


//Creating Sessions For User 
export const createUser = async (email, password, username) => {
    try {
        // Create a new account
        const newAccount = await account.createVerification(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Account creation failed');

        // Sign in the user immediately after creating the account
        const session = await signIn(email, password);

        // Create the user document in the database
        const avatarUrl = avatars.getInitials(username);
        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountid: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error.message || 'Error creating user');
    }
};

export const signIn = async (email, password) => {
    try {
        // Try to get the current session
        let session;
        try {
            session = await account.get();
        } catch (err) {
            // If no session exists, create a new session with provided credentials
            session = await account.createEmailPasswordSession(email, password);
        }

        // Return the session object
        return session;
    } catch (error) {
        throw new Error(error.message || 'Error signing in');
    }
};


// Getiing Current Logged User
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error('No current account found');
        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountid', currentAccount.$id)]
        );
        if (!currentUser || currentUser.documents.length === 0) throw Error('User not found');
        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error.message || 'Error fetching current user');
    }
};

//User Feed
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
}

export const getUserPosts = async (userID) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userID),Query.orderDesc('$createdAt')]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
}

//User Action
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
}


//Clearing Sessions Created
export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error.message || 'Error signing out');
    }
}

//Creating a Post and Submitting to DB
export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {

        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 5000, 5000, 'top', 100);
        }
        else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw new Error('Error fetching file preview');
        return fileUrl;
    } catch (error) {
        throw new Error(error.message || 'Error fetching file preview');
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };


    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error.message || 'Error uploading file');
    }
}

export const CreateVideo = async (form) => {
    try {

        const [thumbnailUrl, videoUrl] = await Promise.all(
            [
                uploadFile(form.thumbnail, 'image'),
                uploadFile(form.video, 'video'),
            ]
        );

        const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
            title: form.title,
            prompt: form.prompt,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            creator: form.userID,
        });

        return newPost;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'Error creating video');
    }
}

//Bookmarks Logics
const getUserDocument = async (userId, collectionId) => {
    try {
      const userDocument = await databases.getDocument(databaseId, collectionId, userId);
      console.log('userDocument:', userDocument);
  
      // Set default roleID if it's null or undefined
      userDocument.roleID = userDocument.roleID || 'user';
  
      return userDocument;
    } catch (error) {
      console.error('Error getting user document:', error);
      return null;
    }
  };
  export const likePost = async (videoUrl, userId, unlike = false) => {
    try {
      // Step 1: Get the current user
      const user = await getCurrentUser();
  
      // Step 2: Get the video document
      const videoDocument = await getVideoDocument(videoUrl);
  
      // Step 3: Get the user document
      const userDocument = await getUserDocument(user.$id, user.$collectionId);
  
      // Step 4: Check if the user has already liked/unliked the video
      if (unlike && (!userDocument.LikedVideos || !userDocument.LikedVideos.includes(videoDocument.$id))) {
        console.log('User has not liked the video');
        return;
      }
  
      if (!unlike && userDocument.LikedVideos && userDocument.LikedVideos.includes(videoDocument.$id)) {
        console.log('User has already liked the video');
        return;
      }
  
      // Step 5: Update the user document with LikedVideos
      await updateUserDocument(userDocument, videoDocument.$id, unlike);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      console.log('Like post function completed');
    }
  };
  
  // Helper function to get the video document
  const getVideoDocument = async (videoUrl) => {
    const videoDocument = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('video', videoUrl)],
    );
  
    if (videoDocument.documents.length > 0) {
      return videoDocument.documents[0];
    } else {
      throw new Error('Video document not found');
    }
  };
  
  // Helper function to get the user document
  const updateUserDocument = async (userDocument, videoDocumentId, unlike = false) => {
    if (!userDocument) {
      console.error('User document not found');
      return;
    }
  
    let likedVideos = userDocument.LikedVideos || [];
  
    if (unlike) {
      likedVideos = likedVideos.filter((id) => id !== videoDocumentId);
    } else {
      likedVideos.push(videoDocumentId);
    }
  
    const newUserDocument = {
      accountid: userDocument.accountid,
      avatar: userDocument.avatar,
      email: userDocument.email,
      roleID: userDocument.roleID || 'user', // Set roleID to 'user' if it's null or undefined
      username: userDocument.username,
      LikedVideos: likedVideos,
    };
  
    console.log('newUserDocument:', newUserDocument); // Add this line
  
    try {
      await databases.updateDocument(
        databaseId,
        userDocument.$collectionId,
        userDocument.$id,
        { data: newUserDocument },
      );
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  };


  export const getLikedPosts = async () => {
    try {
      // Get the current user
      const user = await getCurrentUser();
  
      if (!user || !user.LikedVideos) {
        return [];
      }
  
      // Fetch the liked posts using the LikedVideos attribute
      const likedPosts = await Promise.all(
        user.LikedVideos.map(async (id) => {
          const post = await databases.getDocument(
            databaseId,
            videoCollectionId,
            id,
          );
          return post;
        }),
      );
  
      return likedPosts;
    } catch (error) {
      throw new Error(error.message || 'Error fetching liked posts');
    }
  };