// import { Client, Databases, Storage, ID, } from 'react-native-appwrite';
// import { Platform } from 'react-native';

// interface Message {
//   _id: string;
//   text: string;
//   createdAt: string;
//   user: {
//     _id: string;
//     name: string;
//     avatar?: string;
//   };
//   fileId?: string;
//   fileType?: 'image' | 'pdf';
//   fileUrl?: string;
// }

// class AppwriteService {
//   private client: Client;
//   private databases: Databases;
//   private storage: Storage;
//   private databaseId = 'your_database_id';
//   private collectionId = 'messages';
//   private bucketId = 'files';

//   constructor() {
//     this.client = new Client()
//       .setEndpoint('https://cloud.appwrite.io/v1')
//       .setProject('your_project_id');
//     this.databases = new Databases(this.client);
//     this.storage = new Storage(this.client);
//   }

//   async fetchMessages(): Promise<Message[]> {
//     try {
//       const response = await this.databases.listDocuments(
//         this.databaseId,
//         this.collectionId,
//         ['orderDesc(createdAt)']
//       );
//       return response.documents.map(this.formatMessage);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       return [];
//     }
//   }

//   async sendMessage(message: Partial<Message>): Promise<void> {
//     try {
//       await this.databases.createDocument(
//         this.databaseId,
//         this.collectionId,
//         ID.unique(),
//         {
//           userId: message?.user?._id,
//           text: message.text,
//           fileId: message.fileId,
//           fileType: message.fileType,
//           createdAt: new Date().toISOString(),
//         }
//       );
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   }

//   async uploadFile(file: {
//     uri: string;
//     type: string;
//     name: string;
//   }): Promise<{ fileId: string; fileUrl: string; fileType: 'image' | 'pdf' }> {
//     try {
//       const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
//       const response = await this.storage.createFile(
//         this.bucketId,
//         ID.unique(),
//         Platform.OS === 'ios'
//           ? {
//               uri: file.uri.replace('file://', ''),
//               type: file.type,
//               name: file.name,
//             }
//           : file
//       );
//       const fileUrl = `${this.client.endpoint}/storage/buckets/${this.bucketId}/files/${response.$id}/view?project=${this.client.config.project}`;
//       return { fileId: response.$id, fileUrl, fileType };
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw error;
//     }
//   }

//   subscribeToMessages(callback: (message: Message) => void): () => void {
//     const subscription = this.client.subscribe(
//       `databases.${this.databaseId}.collections.${this.collectionId}.documents`,
//       (response: any) => {
//         if (
//           response.events.includes(
//             'databases.*.collections.*.documents.*.create'
//           )
//         ) {
//           callback(this.formatMessage(response.payload));
//         }
//       }
//     );
//     return () => subscription();
//   }

//   private formatMessage(doc: any): Message {
//     return {
//       _id: doc.$id,
//       text: doc.text || '',
//       createdAt: doc.createdAt,
//       user: {
//         _id: doc.userId,
//         name: doc.userId, // Replace with actual user name from your user collection
//         avatar: 'https://example.com/avatar.png', // Replace with actual avatar
//       },
//       fileId: doc.fileId,
//       fileType: doc.fileType,
//       fileUrl: doc.fileId
//         ? `${this.client.endpoint}/storage/buckets/${this.bucketId}/files/${doc.fileId}/view?project=${this.client.config.project}`
//         : undefined,
//     };
//   }
// }

// export const appwriteService = new AppwriteService();
