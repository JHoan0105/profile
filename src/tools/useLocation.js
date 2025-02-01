import { useState, useEffect } from 'react';

export default async function useLocation(){

/*    const [location, setLocationData] = useState();

    useEffect(() => {
        getLocationData();
    }, [])

    const getLocationData = async () => {
        const response = await fetch('https://geolocation-db.com/json/');
        const data = await response.json();
        setLocationData(data)
    }*/

    const response = await fetch('https://geolocation-db.com/json/');

 
    return { response }
    
}