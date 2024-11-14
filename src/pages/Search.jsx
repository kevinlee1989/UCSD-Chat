import React, { useState } from 'react';
import { TextField, List, ListItem, Box, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([{'_id': 1, 'course_name': 'class1'}, {'_id':2, 'course_name': 'class2'}]);
    const [data, setData] = useState('');

    const { currentUser } = useAuth();
    const navigate = useNavigate();

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
            position="relative" 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Box position="absolute" top="20px" left="20px"display="flex" alignItems="center" width="100%" padding="20px">
                <KeyboardBackspaceIcon
                    onClick={() => navigate('/')}
                    style={{ fontSize: '50px', cursor: 'pointer', marginRight: '10px' }}
                />
                <Typography variant="h4">Home</Typography>
            </Box>
            
            {/* Label above the search bar */}
            <Typography variant="h6" gutterBottom>
                Enter your UCSD Class Name!
            </Typography>

            {/* Centered search input */}
            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Type to search..."
                style={{ width: '300px', marginBottom: '20px' }}
            />

            {/* List of search results */}
            <List>
                {searchResults.map((item) => (
                    <ListItem key={item._id}>{item.course_name}</ListItem>
                    // <ListItem>{item}</ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Search;