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


// Ensure this function is properly defined
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

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
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

export const getUserPosts = async (userID) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userID)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
}


export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error.message || 'Error signing out');
    }
}


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