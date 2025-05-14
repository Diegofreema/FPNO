import { API_ENDPOINT, PROJECT_ID } from '@/config';
import { Client, Databases, Models, Storage } from 'react-native-appwrite';

// console.log({ API_ENDPOINT, PROJECT_ID, PROJECT_NAME });
let client: Client;
let databases: Databases;
let storage: Storage;
client = new Client();
client
  .setEndpoint(API_ENDPOINT)
  .setProject(PROJECT_ID) // Your Project ID
  .setPlatform('com.diegodark.FPNO');

databases = new Databases(client);
storage = new Storage(client);
export { client, databases, Models, storage };
