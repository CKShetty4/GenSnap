import SignIn from '@/app/(auth)/sign-in';
import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ckshetty.gensnap',
    projectId: '66cc21db00243e062ffe',
    databaseId: '66cc2474002443e52c02',
    userCollectionId: '66cc24b3000bc6c5586f',
    videoCollectionId: '66cc24e20028bc613225',
    storageId: '66cc274b0014df711a08',

}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(Config.endpoint)
    .setProject(Config.projectId)
    .setPlatform(Config.platform)
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {//since we are using async await we need to use try catch block
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            Config.databaseId,
            Config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            })
return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);//feature of appwrite to get the valid email and password to login
        return session;
    } catch (error) {
        throw new Error(error);
    }
}
