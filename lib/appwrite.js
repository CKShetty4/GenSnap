import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ckshetty.gensnap',
    projectId: '66cc21db00243e062ffe',
    databaseId: '66cc2474002443e52c02',
    userCollectionId: '66cc24b3000bc6c5586f',
    videoCollectionId: '66cc24e20028bc613225',
    storageId: '66cc274b0014df711a08',

}

const{
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
}=Config;


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

export const getAllPosts=async()=>{
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


export const getLatestPosts =async()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
} 


export const searchPosts =async(query)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching posts');
    }
} 