import React, {useCallback, useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';


type Props = {
    pdfUrl: string,
    style:  StyleProp<ViewStyle>
}


const PdfViewer = ({pdfUrl,style}: Props) => {
    const [pdfUri, setPdfUri] = useState<{uri: string, cache: boolean} | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Appwrite PDF URL

    const localPdfPath = `${FileSystem.documentDirectory}document.pdf`;

    // Request storage permissions for Android
    const requestStoragePermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                return (
                    granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn('Permission error:', err);
                return false;
            }
        }
        return true; // iOS doesn't need explicit permission for this
    }, []);

    // Download and cache PDF for Android, use direct URL for iOS
    const setupPdf = useCallback(async () => {
        try {
            if (Platform.OS === 'android') {
                // Check permissions for Android
                const hasPermission = await requestStoragePermission();
                if (!hasPermission) {
                    setError('Storage permission denied. Please grant permission to view the PDF.');
                    Alert.alert('Permission Denied', 'Storage permission is required to view PDFs on Android.');
                    return;
                }

                // Check if file exists locally
                const fileInfo = await FileSystem.getInfoAsync(localPdfPath);
                if (fileInfo.exists) {
                    setPdfUri({ uri: localPdfPath, cache: true });
                    return;
                }

                // Download PDF with headers (if needed)
                const { uri } = await FileSystem.downloadAsync(pdfUrl, localPdfPath, {
                    headers: {
                        // Add Appwrite-specific headers if required (e.g., API key)
                        // 'X-Appwrite-Project': '681b3f0a00211d68896c',
                    },
                });
                setPdfUri({ uri, cache: true });
            } else {
                // iOS can use the remote URL directly
                setPdfUri({ uri: pdfUrl, cache: false });
            }
        } catch (err: any) {
            setError(`Failed to load PDF: ${err.message}`);
            console.error('PDF setup error:', err);
        }
    }, [pdfUrl, localPdfPath, requestStoragePermission]);

    useEffect(() => {
      void setupPdf();
    }, [setupPdf]);

    return (
        <View style={style}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : pdfUri ? (
                <Pdf
                    source={pdfUri}
                    style={styles.pdf}
                    trustAllCerts={Platform.OS !== 'android'}
                    onLoadComplete={(numberOfPages) => {
                        console.log(`PDF loaded with ${numberOfPages} pages`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}/${numberOfPages}`);
                    }}
                    onError={(err) => {
                        setError(`PDF rendering error: ${err}`);
                        console.error('PDF render error:', err);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading PDF...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4', // Light gray background
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#000000', // Black text
        fontSize: 16,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#000000', // Black text
        fontSize: 16,
    },
});

export default PdfViewer;