import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
}

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        perPage: 40,
    });
    const unsplashResults = photos.response?.results || [];
    return unsplashResults.map((result) => result.urls["small"]);
}

export const fetchCoffeeStores = async (latLong = "-1.2853476396363974,36.85792385519786", limit=6) => {
    const photos = await getListOfCoffeeStorePhotos();
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };
      
    const response = await fetch(getUrlForCoffeeStores(latLong, "coffee shop", limit), options)
    const data = await response.json();
    return data.results.map((result, idx) => {
        return {
            id: result.fsq_id,
            address: result.location.address || "",
            name: result.name,
            locality: result.location.locality,
            imgUrl: photos.length > 0 ? photos[idx] : null,
        } || [];
    })
    
    // .catch(err => console.error(err));
}