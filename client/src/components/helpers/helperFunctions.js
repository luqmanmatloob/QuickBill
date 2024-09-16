// Function to get the next order number
export async function getNextOrderNumber(baseURL, token) {
    const url = `${baseURL}/api/invoicequote/getNextOrderNumber`;
    console.log(`this is url ${url}`)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.nextOrderNumber; // Extract the orderNumber from the response

    } catch (error) {
        console.error('Error fetching the next order number:', error);
        throw error; 
    }
}

// Usage example
// const token = ''
// const baseURL = 'http://localhost:3001';

// getNextOrderNumber(baseURL, token)
//     .then(nextNumber => {
//         console.log('Next Order Number:', nextNumber);
//     })
//     .catch(error => {
//         console.error('Failed to fetch next order number:', error);
//     });



