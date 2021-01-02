import { PDFDownloadLink, StyleSheet, Document, Page, BlobProvider, Text, View } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const MyDoc = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
)

export const App = () => (
    <div>
        <BlobProvider document={MyDoc}>
            {({ blob, url, loading, error }) => {
                // Do whatever you need with blob here
                return <div>There's something going on on the fly</div>
            }}
        </BlobProvider>
    </div>
)