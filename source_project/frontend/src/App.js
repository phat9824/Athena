import {React, useEffect} from 'react';
import {RouterProvider} from 'react-router-dom';
import router from './router.js'

const App = () => {
    return (
        <RouterProvider router={router} /> 
    );
};

export default App;