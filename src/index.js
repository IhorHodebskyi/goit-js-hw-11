import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import fetchImages from './js/fetchImages';
import renderGallery from './js/renderGallery';

const searchingBox = document.querySelector('.searching-box');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const upBtn = document.querySelector('.up-btn');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const clear = elems => [...elems.children].forEach(div => div.remove());
const loadBtn = document.querySelector('.load-more');
const lightbox = () => new SimpleLightbox('.gallery a', {});

searchForm.addEventListener('submit', eventHandler);

let perPage = 40;
let page = 0;
let name = searchQuery.value;

loadBtn.style.display = 'none';
upBtn.style.display = 'none';

async function eventHandler(ev) {
   ev.preventDefault();
   clear(gallery);
   loadBtn.style.display = 'none';
   page = 1;
   name = searchQuery.value;
   console.log(name);
   fetchImages(name, page)
      .then(name => {
         console.log(`Number of arrays: ${name.hits.length}`);
         console.log(`Total hits: ${name.totalHits}`);
         let totalPages = Math.ceil(name.totalHits / perPage);
         console.log(`Total pages: ${totalPages}`);

         if (name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
            renderGallery(name);
            console.log(`Current page: ${page}`);
            lightbox();
            upBtn.style.display = 'block';
            upBtn.addEventListener('click', onsCroll);

            function onsCroll() {
               searchingBox.scrollIntoView({
                  behavior: 'smooth',
               });
            }

            if (page < totalPages) {
               loadBtn.style.display = 'block';
            } else {
               loadBtn.style.display = 'none';
               console.log('There are no more images');
               Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
         } else {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            clear(gallery); //reset view in case of failure
         }
      })
      .catch(error => console.log(error));
}

loadBtn.addEventListener('click', onClick);

function onClick() {
   name = searchQuery.value;
   console.log('load more images');
   page += 1;
   fetchImages(name, page).then(name => {
      let totalPages = Math.ceil(name.totalHits / perPage);
      renderGallery(name);
      //smooth scroll
      const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

      window.scrollBy({
         top: cardHeight * 2,
         behavior: 'smooth',
      });
      //===
      lightbox().refresh();
      console.log(`Current page: ${page}`);

      if (page >= totalPages) {
         loadBtn.style.display = 'none';
         console.log('There are no more images');
         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
   });
}
