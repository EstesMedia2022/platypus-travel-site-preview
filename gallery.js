const mediaRoot='https://d8j0ntlcm91z4.cloudfront.net/user_2zMoBvwOahwmf1W00qwtrZho3TG/';
const photoUrl=p=>p.file.startsWith('assets/')?p.file:mediaRoot+p.file;
const lifestylePhotos=[
 {file:'hf_20260911_184510_4470eefb-5467-499a-b481-0841d5ee0872.png',title:'A little comfort, all the way.',alt:'Older woman wearing the black neck pillow in a warmly lit airplane cabin'},
 {file:'hf_20260911_174442_dafa8776-60f0-4df3-b564-ade70cfddafe.png',title:'Your everyday travel companion.',alt:'Woman wearing the compact black neck pillow in her airplane seat'},
 {file:'hf_20260911_184511_4a79878e-4215-4fa8-9580-ae8113e70d46.png',title:'Together for the journey.',alt:'School-age child wearing the compact pillow beside a parent',note:'Concept for review · Child age and fit guidance pending'},
 {file:'hf_20260911_151357_f0bc84ab-f924-4383-8667-4462cd57fa1f.png',title:'The getaway starts here.',alt:'Compact pillow on a suitcase beside a golf travel bag'},
 {file:'assets/actual-use-side.jpeg',title:'The actual fit and resting position.',alt:'Actual side-view photograph showing the full-height pillow on lap and sloped face cradle'},
 {file:'assets/inflated/24.jpg',title:'Every detail, as designed.',alt:'Actual product side view showing sloped cushion, scalloped arm opening and valve'}
];
function photoCard(photo,i){return `<figure class="travel-card"><button class="photo-open" data-photo="${i}" aria-label="Enlarge: ${photo.alt}"><img src="${photoUrl(photo)}" alt="${photo.alt}" loading="lazy"><span class="photo-zoom" aria-hidden="true">↗</span></button><figcaption>${photo.title}${photo.note?`<small>${photo.note}</small>`:''}</figcaption></figure>`;}
const photoSection=document.createElement('section');photoSection.className='section travel-gallery';photoSection.id='travel-gallery';photoSection.innerHTML=`<div class="wrap"><div class="section-head"><div><span class="eyebrow">COMFORT COMES ALONG</span><h2>For the journey.<br>For your kind of rest.</h2></div><p>Wear it while you travel. Unpack it when you want to settle in. Explore both forms in moments of everyday travel comfort.</p></div><div class="travel-grid">${lifestylePhotos.map(photoCard).join('')}</div><p class="gallery-review">New lifestyle imagery shown for approval. Child-use concept awaits product age and fit guidance.</p></div>`;
document.querySelector('.closing').before(photoSection);
if(page==='home'){
 document.querySelector('.golf .split-photo').src=photoUrl(lifestylePhotos[3]);
 document.querySelector('.golf .split-photo').alt=lifestylePhotos[3].alt;
 document.querySelector('.golf .split-photo').style.objectFit='cover';
 document.querySelector('.dark .split-photo').src=photoUrl(lifestylePhotos[0]);
 document.querySelector('.dark .split-photo').alt=lifestylePhotos[0].alt;
}
if(page==='about'){
 const aboutImage=document.querySelector('.about-photo');aboutImage.src=photoUrl(lifestylePhotos[0]);aboutImage.alt=lifestylePhotos[0].alt;aboutImage.style.objectPosition='center 32%';
}
if(page==='product'){
 const thumbnails=document.querySelector('.thumbnails');thumbnails.classList.add('photo-thumbnails');thumbnails.innerHTML=lifestylePhotos.map((p,i)=>`<button class="photo-open" data-photo="${i}" aria-label="Enlarge: ${p.alt}"><img src="${photoUrl(p)}" alt="${p.alt}" loading="lazy"></button>`).join('');
}
const photoDialog=document.createElement('dialog');photoDialog.className='photo-dialog';photoDialog.innerHTML='<button class="photo-close" aria-label="Close photograph">×</button><img alt=""><p></p>';document.body.append(photoDialog);
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const p=lifestylePhotos[Number(button.dataset.photo)];photoDialog.querySelector('img').src=photoUrl(p);photoDialog.querySelector('img').alt=p.alt;photoDialog.querySelector('p').textContent=p.title+(p.note?' — '+p.note:'');photoDialog.showModal();}));
photoDialog.querySelector('.photo-close').onclick=()=>photoDialog.close();
