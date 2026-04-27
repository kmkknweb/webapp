const GA_ID = 'G-6WSETYKBH2';

const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
script.async = true;
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_ID);
``
