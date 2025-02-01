import { useState, useEffect } from 'react';

export default async function useFetchUser() {

        const response = await fetch('https://jsonplaceholder.typicode.com/users?id=1');
        const user = await response.json();
    return { user }
}