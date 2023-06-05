import axios from 'axios';

let perPage = 40;

export default async function fetchImages(name, page) {
   try {
      const response = await axios.get(`https://pixabay.com/api/?key=36811784-c13148b3b1c3296db8a3ae716&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
      console.log(response);
      return response.data;
   } catch (error) {
      console.log(error);
   }
}
