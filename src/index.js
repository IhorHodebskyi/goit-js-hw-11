import Notiflix from 'notiflix';
import fetchImages from './js/fetchImages';
import renderGallery from './js/renderGallery';
import { refs } from './js/refs';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = () => new SimpleLightbox('.gallery a', {});

const clear = elems => [...elems.children].forEach(div => div.remove());

refs.searchForm.addEventListener('submit', eventHandler);

export let perPage = 40;
export let page = 0;
export let name = refs.searchQuery.value;

refs.loadBtn.style.display = 'none';
refs.upBtn.style.display = 'none';

async function eventHandler(ev) {
   ev.preventDefault();
   clear(refs.gallery);
   refs.loadBtn.style.display = 'none';
   page = 1;
   name = refs.searchQuery.value;
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
            refs.upBtn.style.display = 'block';
            refs.upBtn.addEventListener('click', onsCroll);

            function onsCroll() {
               refs.searchingBox.scrollIntoView({
                  behavior: 'smooth',
               });
            }

            if (page < totalPages) {
               refs.loadBtn.style.display = 'block';
            } else {
               refs.loadBtn.style.display = 'none';
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

refs.loadBtn.addEventListener('click', onClick);

export default function onClick() {
   name = refs.searchQuery.value;
   console.log('load more images');
   page += 1;
   fetchImages(name, page).then(name => {
      let totalPages = Math.ceil(name.totalHits / perPage);
      renderGallery(name);
      //smooth scroll
      // const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

      // window.scrollBy({
      //    top: cardHeight * 2,
      //    behavior: 'smooth',
      // });
      //===
      lightbox().refresh();
      console.log(`Current page: ${page}`);

      if (page >= totalPages) {
         refs.loadBtn.style.display = 'none';
         console.log('There are no more images');
         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
   });
}
