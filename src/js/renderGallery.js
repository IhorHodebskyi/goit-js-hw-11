const gallery = document.querySelector('.gallery');

export default function renderGallery(name) {
   const markup = name.hits
      .map(hit => {
         return `<div class="photo-card">
       <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
       <div class="info">
         <p class="info-item">
           <p><b>Likes</b> <br>${hit.likes}</br></p>
         </p>
         <p class="info-item">
           <p><b>Views</b> <br>${hit.views}</br></p>
         </p>
         <p class="info-item">
           <p><b>Comments</b> <br>${hit.comments}</br></p>
         </p>
         <p class="info-item">
           <p><b>Downloads</b> <br>${hit.downloads}</br></p>
         </p>
       </div>
     </div>`;
      })
      .join('');
   gallery.insertAdjacentHTML('beforeend', markup);
}
