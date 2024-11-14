import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { TextField, List, ListItem, Box, Typography } from '@mui/material';
import axios from 'axios';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const handleChange = async (event) => {
        const inputValue = event.target.value;
        setSearchTerm(inputValue);

        if (inputValue.trim() !== '') {
            const response = await axios.get('http://localhost:3001/course', {
                headers: { 'Content-Type': 'application/json' },
                params: { course: inputValue },
            });

            if (response.data) {
                setSearchResults(response.data);
            }
        } else {
            setSearchResults([]); // Clear results if input is empty
        }
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center" // Centers vertically
            >
                <KeyboardBackspaceIcon onClick={()=> navigate('/')}
                                       style={{fontSize: "50px", cursor: "pointer"}}
                                       className={"sticky z-50 top-0 self-start"}
                />
                {/* Centered search input */}
                <Box width="500px" marginBottom="20px" marginTop="35vh" className={"sticky top-0" +
                    " z-40 bg-white"}> {/* Box to
             control
             width and spacing */}
                    {/* Label above the search bar */}
                    <Typography variant="h6" gutterBottom className={"sticky top-0"}>
                        Enter your UCSD Class Name!
                    </Typography>

                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder="Type to search..."
                    />
                </Box>
                <Box className={"sticky top-0"}>
                    {/* Conditionally render the list only if searchTerm is not empty */}
                    {searchTerm.trim() !== '' && (
                        <List style={{ width: '500px' }} > {/* Keep the
                 list
                 aligned with the search box */}
                            {searchResults.length > 0 ? (
                                searchResults.map((item) => (
                                    <ListItem key={item._id}>{item.course_name}</ListItem>
                                ))
                            ) : (
                                <ListItem>No results found</ListItem>
                            )}
                        </List>
                    )}
                </Box>

            </Box>
        </>
    );
};

export default Search;
