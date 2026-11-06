(()=>{
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.film-copy');
const sections=[...document.querySelectorAll('.introduction,.featured,.catalogue,.reading,.author')];
let pending=0;
function paint(){
 pending=0;
 const still=reduce.matches||document.body.classList.contains('static-motion');
 const progress=Math.min(1,Math.max(0,scrollY/(innerHeight*.8)));
 if(hero){hero.style.opacity=still?'1':String(1-progress*.9);hero.style.transform=still?'none':`translateY(${-progress*28}px)`;}
 const reading=sections.some(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight*.45&&r.bottom>innerHeight*.55;});
 if(document.body.classList.contains('reading-focus')!==reading) document.body.classList.toggle('reading-focus',reading);
}
function schedule(){if(!pending)pending=requestAnimationFrame(paint);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduce.addEventListener('change',schedule);
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
paint();
})();
