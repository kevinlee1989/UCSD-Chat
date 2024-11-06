import React, { useState } from 'react';
import { TextField, List, ListItem, Box, Typography } from '@mui/material';

function SearchBar({ data }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        setSearchTerm(inputValue);

        const results = data.filter((item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSearchResults(results);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            {/* Label above the search bar */}
            <Typography variant="h6" gutterBottom>
                Enter your UCSD Class Name!
            </Typography>

            {/* Centered search input */}
            <TextField
                label="Search"
                variant="outlined"
                fullWidth={false}
                value={searchTerm}
                onChange={handleChange}
                placeholder="Type to search..."
                style={{ width: '500px' }}
            />

            {/* List of search results */}
            <List>
                {searchResults.map((item) => (
                    <ListItem key={item.id}>{item.name}</ListItem>
                ))}
            </List>
        </Box>
    );
}

export default SearchBar;
