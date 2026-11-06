(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const storage = {
    get(key, fallback = '') { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Reading still works in private mode. */ } }
  };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';
  const books = [
    {id:'crime',title:'罪与罚',english:'Crime and Punishment',year:'1866',type:'novel',themes:'罪责 / 自由 / 救赎',people:'拉斯克尔尼科夫、索尼娅、波尔菲里',question:'当理由足够强大，越界就能被原谅吗？',intro:'贫困的青年拉斯克尔尼科夫相信，有些人可以为了更高的目的越过道德。他犯下罪行后，真正无法摆脱的并不只是追查，而是自己不断分裂的意识。',guide:'先留意他如何为自己辩护，再观察现实中的人如何一次次打断他的理论。索尼娅的存在，让抽象的“人类”重新变成一个可以被看见、被伤害、也可以被爱的具体的人。',start:'适合想从强烈情节进入陀氏世界的读者。阅读时可把人物的全名、父称与昵称记在一起。',link:'https://www.gutenberg.org/ebooks/2554'},
    {id:'brothers',title:'卡拉马佐夫兄弟',english:'The Brothers Karamazov',year:'1879—1880',type:'novel',themes:'信仰 / 怀疑 / 责任',people:'德米特里、伊万、阿辽沙、斯乜尔加科夫',question:'如果没有一个共同答案，我们还如何承担责任？',intro:'一个家族的冲突，逐渐展开为关于欲望、信仰、自由与责任的多声部争辩。兄弟们无法用同一种方式理解世界，却也无法真正脱离彼此。',guide:'不必急着判断谁代表作者。让伊万的怀疑与阿辽沙的信念同时存在，注意每个人说出的道理，如何被他自己的生活检验。',start:'适合愿意慢读的读者。先认清家族关系，再进入长段对话，不必一次读完所有思想。',link:'https://www.gutenberg.org/ebooks/28054'},
    {id:'idiot',title:'白痴',english:'The Idiot',year:'1868—1869',type:'novel',themes:'善意 / 尊严 / 伤害',people:'梅什金、娜斯塔霞、罗戈任、阿格拉娅',question:'一个真诚善良的人，能在复杂的世界里幸存吗？',intro:'梅什金公爵回到俄国。他的坦率与同情，触动了一个围绕金钱、身份与爱情运转的社交世界。善意并没有让关系变得简单，反而暴露出每个人最深的创伤。',guide:'关注“怜悯”与“爱”的区别。一个人被拯救的愿望，也可能让另一个人感到自己的尊严再次被剥夺。',start:'适合对人物关系与情感张力感兴趣的读者。初读可先沿着梅什金与娜斯塔霞两条线走。',link:'https://www.gutenberg.org/ebooks/2638'},
    {id:'underground',title:'地下室手记',english:'Notes from Underground',year:'1864',type:'short',themes:'自我意识 / 反抗 / 孤独',people:'地下室人、丽莎',question:'明明知道什么对自己有益，为什么仍要反着做？',intro:'一位退居地下室的叙述者，对自己的思想与记忆进行尖锐而反复的剖析。他渴望被理解，又不断用讥讽与自尊破坏接近他人的可能。',guide:'这位叙述者并不可靠。不要把他的每一句判断当成结论；观察他何时反驳别人，又何时推翻刚刚说过的自己。',start:'篇幅较短，阅读强度却不低。可以分开读论辩与回忆两部分，留意两者的相互拆解。',link:'https://www.gutenberg.org/ebooks/600'},
    {id:'nights',title:'白夜',english:'White Nights',year:'1848',type:'short',themes:'梦 / 相遇 / 温柔',people:'梦幻者、娜斯坚卡',question:'短暂的幸福，是否也足以照亮一个人的一生？',intro:'圣彼得堡的白夜里，一位习惯独自幻想的青年遇见娜斯坚卡。几个夜晚的交谈，让一个几乎只活在想象中的人，短暂地走进真实的关系。',guide:'注意叙述者如何把城市、天气与感情联在一起。故事里的温柔，也始终带着现实与幻想之间的不对称。',start:'适合作为第一本陀氏作品。篇幅轻巧，情绪清晰，也能看到他对孤独者始终保有的关切。',link:'https://www.gutenberg.org/ebooks/36034'},
    {id:'gambler',title:'赌徒',english:'The Gambler',year:'1866',type:'novel',themes:'欲望 / 依赖 / 金钱',people:'阿列克谢、波琳娜、将军',question:'我们以为自己在等待赢一次，其实在等待什么？',intro:'在一座欧洲温泉城，金钱、爱情与身份焦虑纠缠在一起。阿列克谢走向轮盘赌桌，也走向一种越来越难以辨认的依赖。',guide:'赌局的节奏与感情关系彼此映照。留意人物口中的“自由”，是否常常依附于某个人、某笔钱或下一次翻盘。',start:'适合喜欢紧凑故事的读者。可以把它与《罪与罚》并读，比较两位青年如何解释自己的选择。',link:'https://www.gutenberg.org/ebooks/2197'},
    {id:'poor',title:'穷人',english:'Poor Folk',year:'1846',type:'novel',themes:'贫穷 / 书信 / 尊严',people:'马卡尔·杰武什金、瓦尔瓦拉',question:'一个人的尊严，要怎样从窘迫中被看见？',intro:'两位生活困窘的人通过书信关心彼此。他们谈衣服、房租、工作和阅读，也在小心翼翼的措辞中保全自尊，寻找被理解的可能。',guide:'书信里的琐事不是背景，它们本身就是人物的处境。注意一件旧衣或一句无意的话，怎样改变一个人的自我感受。',start:'适合想从早期作品了解作者的读者。与晚期长篇相比，这里更贴近日常生活中的脆弱与体面。',link:'https://www.gutenberg.org/ebooks/author/314'},
    {id:'demons',title:'群魔',english:'Demons',year:'1871—1872',type:'novel',themes:'观念 / 权力 / 群体',people:'斯塔夫罗金、彼得·韦尔霍文斯基、沙托夫',question:'当观念变成支配他人的工具，会发生什么？',intro:'一座外省城市中的思想争执与私人关系，逐渐被卷入政治阴谋。不同人物为同样响亮的词语赋予截然不同的意义，观念与欲望互相借力。',guide:'先厘清人物与派别，再观察抽象理想如何在具体行动中变形。尤其要区分一个人的信念，与他用信念掩盖的目的。',start:'更适合已有陀氏阅读经验的读者。人物较多，可在阅读中记录关系，而不必一开始全部记住。',link:'https://www.gutenberg.org/ebooks/author/314'}
  ];
  let saved;
  try { const raw = JSON.parse(storage.get('dostoevsky-books', '[]')); saved = new Set(Array.isArray(raw) ? raw.filter(id => books.some(book => book.id === id)) : []); } catch { saved = new Set(); }
  let filter = 'all';
  let openedBook = '';

  let deckFrame = 0;
  const coverImages = window.DOSTOEVSKY_COVERS || {};
  function renderBooks() {
    $('#bookList').innerHTML = books.map(book => {
      const cover = typeof coverImages[book.id] === 'string' && coverImages[book.id].startsWith('assets/covers/') ? `<img class="cover-image" src="${escapeHTML(coverImages[book.id])}" alt="" loading="lazy" width="1536" height="2048">` : '';
      return `<article class="book-entry book-card" id="book-${book.id}" data-book="${book.id}"><button class="work-toggle card-face" type="button" data-book-toggle="${book.id}" aria-expanded="false" aria-controls="panel-${book.id}"><span class="cover-visual ${cover ? 'has-cover' : 'type-cover'}">${cover}<span class="cover-year">${book.year}</span><span class="cover-title"><strong>${book.title}</strong><span>${book.themes}</span></span></span><span class="card-caption"><span class="book-en">${book.english}</span><span class="card-invitation">展开导读 ${arrow}</span></span></button></article>`;
    }).join('');
    $('#bookDetails').innerHTML = books.map(book => `<div class="book-panel" id="panel-${book.id}" inert><div><div class="book-detail"><div><h3>${book.title} · 阅读导览</h3><p>${book.intro}</p><p class="people">人物：${book.people}</p><div class="detail-actions"><button type="button" class="bookmark-button" data-save="${book.id}" aria-pressed="${saved.has(book.id)}">${saved.has(book.id) ? '已加入书架' : '加入我的书架'}</button><a href="${book.link}" target="_blank" rel="noopener noreferrer">${['poor','demons'].includes(book.id) ? '查阅英文书目' : '阅读英文译本'} ${arrow}</a></div></div><div><p class="guide-question">${book.question}</p><p>${book.guide}</p><p>${book.start}</p></div></div></div></div>`).join('');
    $('#savedCount').textContent = saved.size;
    applyFilter();
  }
  function visibleCards() { return $$('.book-card').filter(card => !card.hidden); }
  function updateDeck() {
    deckFrame = 0;
    const rail = $('#bookList'), cards = visibleCards();
    const middle = rail.scrollLeft + rail.clientWidth / 2;
    let nearest = 0, distance = Infinity;
    cards.forEach((card, index) => {
      const delta = (card.offsetLeft + card.offsetWidth / 2 - middle) / rail.clientWidth;
      const magnitude = Math.min(1, Math.abs(delta));
      card.style.setProperty('--card-rotate', `${Math.max(-8, Math.min(8, -delta * 15))}deg`);
      card.style.setProperty('--card-scale', 1 - magnitude * .045);
      card.style.setProperty('--card-lift', `${magnitude * 12}px`);
      if (Math.abs(delta) < distance) { distance = Math.abs(delta); nearest = index; }
    });
    if (rail.scrollLeft < 2) nearest = 0;
    else if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) nearest = cards.length - 1;
    cards.forEach((card, index) => card.classList.toggle('deck-current', index === nearest));
    $('#cardPosition').textContent = cards.length ? `${nearest + 1} / ${cards.length}` : '0 / 0';
    $('#cardPrevious').disabled = rail.scrollLeft < 2 || cards.length < 2;
    $('#cardNext').disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 || cards.length < 2;
  }
  function scheduleDeck() { if (!deckFrame) deckFrame = requestAnimationFrame(updateDeck); }
  function centerCard(id, behavior = 'smooth') {
    const rail = $('#bookList'), card = $(`#book-${id}`);
    if (!card || card.hidden) return;
    rail.scrollTo({left:card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2, behavior:reduced.matches ? 'instant' : behavior});
  }
  function stepDeck(direction) {
    const cards = visibleCards();
    if (!cards.length) return;
    const rail = $('#bookList');
    const gap = Number.parseFloat(getComputedStyle(rail).gap) || 0;
    rail.scrollBy({left:direction * (cards[0].offsetWidth + gap), behavior:reduced.matches ? 'instant' : 'smooth'});
  }
  $('#cardPrevious').addEventListener('click', () => stepDeck(-1));
  $('#cardNext').addEventListener('click', () => stepDeck(1));
  $('#bookList').addEventListener('scroll', scheduleDeck, {passive:true});
  addEventListener('resize', scheduleDeck, {passive:true});
  $('#bookList').addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') stepDeck(event.key === 'ArrowRight' ? 1 : -1);
    else { const rail = $('#bookList'); rail.scrollTo({left:event.key === 'Home' ? 0 : rail.scrollWidth,behavior:reduced.matches ? 'instant' : 'smooth'}); }
  });
  let drag = null, suppressClick = false;
  const rail = $('#bookList');
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    drag = {pointer:event.pointerId,x:event.clientX,scroll:rail.scrollLeft,moved:false};
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    if (Math.abs(event.clientX - drag.x) > 6 && !drag.moved) { drag.moved = true; suppressClick = true; rail.classList.add('is-dragging'); rail.setPointerCapture(event.pointerId); }
    if (drag.moved) { event.preventDefault(); rail.scrollLeft = drag.scroll - (event.clientX - drag.x); }
  });
  function finishDrag() {
    if (!drag) return;
    const moved = drag.moved, id = drag.pointer; drag = null; rail.classList.remove('is-dragging');
    if (rail.hasPointerCapture(id)) rail.releasePointerCapture(id);
    if (moved) { updateDeck(); const card = $('.deck-current'); if (card) centerCard(card.dataset.book); setTimeout(() => { suppressClick = false; }, 250); }
  }
  rail.addEventListener('pointerup', finishDrag);
  addEventListener('pointerup', finishDrag);
  rail.addEventListener('pointercancel', finishDrag);
  rail.addEventListener('lostpointercapture', finishDrag);
  rail.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; } }, true);

  function applyFilter() {
    const search = $('#bookSearch').value.trim().toLocaleLowerCase();
    let count = 0;
    for (const book of books) {
      const matches = (filter === 'all' || filter === book.type || filter === 'saved' && saved.has(book.id)) && `${book.title} ${book.english} ${book.themes} ${book.people}`.toLocaleLowerCase().includes(search);
      $(`#book-${book.id}`).hidden = !matches;
      if (matches) count++;
    }
    $('#bookEmpty').hidden = count > 0;
    if (openedBook && $(`#book-${openedBook}`).hidden) toggleBook(openedBook);
    $('#bookList').scrollLeft = 0; scheduleDeck();
  }

  function toggleBook(id, forceOpen = false) {
    const button = $(`[data-book-toggle="${id}"]`);
    if (!button) return;
    const open = forceOpen || button.getAttribute('aria-expanded') !== 'true';
    if (openedBook && openedBook !== id) {
      $(`[data-book-toggle="${openedBook}"]`).setAttribute('aria-expanded', 'false');
      const oldPanel = $(`#panel-${openedBook}`);
      oldPanel.classList.remove('is-open'); oldPanel.inert = true;
    }
    button.setAttribute('aria-expanded', String(open));
    const panel = $(`#panel-${id}`);
    panel.classList.toggle('is-open', open); panel.inert = !open;
    openedBook = open ? id : '';
    $$('.book-card').forEach(card => card.classList.toggle('is-open', open && card.dataset.book === id));
    if (open) centerCard(id);
  }

  function openBook(id) {
    filter = 'all'; $('#bookSearch').value = '';
    $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
    applyFilter(); toggleBook(id, true);
    $(`#book-${id}`).scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block:'start'});
    $(`[data-book-toggle="${id}"]`).focus({preventScroll:true});
  }

  $('#works').addEventListener('click', event => {
    const toggle = event.target.closest('[data-book-toggle]');
    if (toggle) toggleBook(toggle.dataset.bookToggle);
    const save = event.target.closest('[data-save]');
    if (save) {
      const id = save.dataset.save;
      saved.has(id) ? saved.delete(id) : saved.add(id);
      storage.set('dostoevsky-books', JSON.stringify([...saved]));
      save.setAttribute('aria-pressed', String(saved.has(id)));
      save.textContent = saved.has(id) ? '已加入书架' : '加入我的书架';
      $('#savedCount').textContent = saved.size;
      if (filter === 'saved') applyFilter();
    }
  });
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilter();
  }));
  $('#bookSearch').addEventListener('input', applyFilter);
  $$('[data-read]').forEach(button => button.addEventListener('click', () => openBook(button.dataset.read)));

  // Scroll moves the time of a short-keyframe film, never the document's wheel events.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const film = $('#storyVideo');
  const scrollSection = $('.film-scroll');
  const poster = $('#filmPoster');
  // taste-skill-ignore: file names match the three generated story chapters.
  const posters = ['assets/scroll-film-v2/背景V2-01-window.jpg','assets/scroll-film-v2/背景V2-05-library.jpg','assets/scroll-film-v2/12-meeting-seedream.jpg'];
  const chapterNames = ['角色的内心', '作品的世界', '作者的书房'];
  const photographs = $$('.featured-image,.reading-image,.author-portrait');
  const timelineItems = $$('.timeline>div');
  let staticMotion = reduced.matches || storage.get('dostoevsky-static') === 'true';
  let progress = 0, smoothed = 0, activeScene = -1, frame = 0, loaded = false, loadStarted = false;
  const clamp = value => Math.min(1, Math.max(0, value));

  function selectScene(scene) {
    if (activeScene === scene) return;
    activeScene = scene;
    $$('[data-scene-copy]').forEach((copy, i) => {
      copy.classList.toggle('is-current', i === scene);
      copy.setAttribute('aria-hidden', String(i !== scene));
      copy.inert = i !== scene;
    });
    $$('[data-scene]').forEach(button => {
      if (Number(button.dataset.scene) === scene) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    $('#sceneName').textContent = chapterNames[scene];
    $('#journeyLabel').textContent = `影像 · ${chapterNames[scene]}`;
    $('#journeySkip').hidden = scene !== 1;
    $('#contentNote').classList.toggle('is-active', scene === 1);
    if (staticMotion || !loaded) poster.src = posters[scene];
  }

  function startLoading() {
    if (loadStarted || staticMotion) return;
    loadStarted = true; film.preload = 'auto'; film.load();
    $('#filmStatus').textContent = '影像加载中 · 可以继续滚动';
  }

  function updateFrame() {
    frame = 0;
    if (staticMotion) return;
    smoothed += (progress - smoothed) * .14;
    if (Math.abs(progress - smoothed) < .0005) smoothed = progress;
    $('#filmProgress').style.transform = `scaleX(${smoothed})`;
    $('#journeyProgress').style.transform = `scaleX(${smoothed})`;
    window.dispatchEvent(new CustomEvent('gothic-progress', {detail:{progress:smoothed}}));
    selectScene(smoothed < .31 ? 0 : smoothed < .65 ? 1 : 2);
    if (loaded && !film.seeking && !document.hidden) {
      const target = Math.max(.025, smoothed * Math.max(0, film.duration - .05));
      if (Math.abs(film.currentTime - target) > .025) {
        try { film.currentTime = target; } catch { /* Static poster remains available. */ }
      }
    }
    if (Math.abs(progress - smoothed) > .0005) frame = requestAnimationFrame(updateFrame);
  }

  function requestFrame() { if (!frame) frame = requestAnimationFrame(updateFrame); }
  function updateScroll() {
    if (staticMotion) { const stillProgress = window.getDostoevskyProgress ? window.getDostoevskyProgress() : 0; selectScene(stillProgress < .31 ? 0 : stillProgress < .65 ? 1 : 2); return; }
    // The complete document, including expanded reading panels, is the timeline.
    progress = window.getDostoevskyProgress ? window.getDostoevskyProgress() : clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    const beyondOpening = scrollY > scrollSection.offsetHeight - innerHeight * .35;
    document.body.classList.toggle('past-opening', beyondOpening);
    const screenCenter = innerHeight * .5;
    photographs.forEach(element => {
      const rect = element.getBoundingClientRect();
      const amount = Math.max(-1, Math.min(1, (rect.top + rect.height * .5 - screenCenter) / innerHeight));
      element.style.setProperty('--photo-drift', `${amount * 24}px`);
    });
    timelineItems.forEach(element => element.classList.toggle('timeline-passed', element.getBoundingClientRect().top < innerHeight * .72));
    const footer = $('.footer-word');
    footer.style.setProperty('--footer-drift', `${Math.max(-16, Math.min(16, (footer.getBoundingClientRect().top - screenCenter) * .025))}px`);
    requestFrame();
  }
  function applyMotionMode() {
    document.body.classList.toggle('static-motion', staticMotion);
    window.dispatchEvent(new CustomEvent('gothic-motion', {detail:{static:staticMotion}}));
    $('#motionToggle').setAttribute('aria-pressed', String(staticMotion));
    $('#motionToggle').textContent = staticMotion ? '开启滚动视频' : '静态阅读';
    $('#journeyMotion').setAttribute('aria-pressed', String(staticMotion));
    $('#journeyMotion').textContent = staticMotion ? '开启动态' : '静态阅读';
    if (staticMotion) {
      film.pause(); poster.src = posters[Math.max(0, activeScene)];
      $('#filmStatus').textContent = '静态阅读模式';
    } else { startLoading(); updateScroll(); }
  }
  film.addEventListener('loadedmetadata', () => { loaded = Number.isFinite(film.duration); requestFrame(); });
  film.addEventListener('loadeddata', () => {
    if (!staticMotion) film.classList.add('is-ready');
    $('#filmStatus').textContent = '向下滚动，跟上他的脚步'; requestFrame();
  });
  film.addEventListener('seeked', () => {
    if (!staticMotion) film.classList.add('is-ready');
    if (Math.abs(film.currentTime - smoothed * (film.duration - .05)) > .04) requestFrame();
  });
  film.addEventListener('error', () => {
    loaded = false; film.classList.remove('is-ready'); poster.src = posters[Math.max(0,activeScene)];
    $('#filmStatus').textContent = '影像暂未加载 · 静帧仍可阅读';
  });
  $('#motionToggle').addEventListener('click', () => {
    staticMotion = !staticMotion; storage.set('dostoevsky-static', String(staticMotion));
    applyMotionMode();
  });
  reduced.addEventListener('change', () => { staticMotion = reduced.matches; applyMotionMode(); });

  function jumpToScene(scene, skip = false) {
    const chapterProgress = [0, .43, .82][scene];
    if (staticMotion) { selectScene(scene); window.dispatchEvent(new CustomEvent('gothic-progress', {detail:{progress:chapterProgress}})); scrollSection.scrollIntoView({behavior:'instant'}); return; }
    // Direct jumps prevent an unwanted flash of the violent chapter when skipping it.
    if (skip) { smoothed = chapterProgress; progress = chapterProgress; selectScene(scene); }
    const top = window.getDostoevskySceneTop ? window.getDostoevskySceneTop(scene) : chapterProgress * (document.documentElement.scrollHeight - innerHeight);
    window.scrollTo({top, behavior: skip || reduced.matches ? 'instant' : 'smooth'});
    requestFrame();
  }
  $$('[data-scene]').forEach(button => button.addEventListener('click', () => jumpToScene(Number(button.dataset.scene))));
  $('#skipViolence').addEventListener('click', () => jumpToScene(2, true));
  $('#journeySkip').addEventListener('click', () => jumpToScene(2, true));
  $('#journeyMotion').addEventListener('click', () => $('#motionToggle').click());
  $$('[data-play-scene]').forEach(button => button.addEventListener('click', () => showFilm(Number(button.dataset.playScene))));
  addEventListener('scroll', updateScroll, {passive:true});
  addEventListener('resize', updateScroll, {passive:true});
  // Reading panels and search change document height; keep the film registered.
  if ('ResizeObserver' in window) new ResizeObserver(updateScroll).observe(document.querySelector('main'));

  function showDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
  function closeDialog(dialog) { dialog.close(); }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('modal-open');
      if (dialog.id === 'filmDialog') $('#fullFilm').pause();
      if (dialog.id === 'chatDialog') { chatAbort?.abort(); window.speechSynthesis?.cancel(); }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
  });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.close))));
  function showFilm(scene = 0) {
    const full = $('#fullFilm'); showDialog($('#filmDialog'));
    const at = [0, 15, 30][scene];
    if (full.readyState >= 1) { full.currentTime = at; full.play().catch(() => {}); }
    else { full.addEventListener('loadedmetadata', () => { full.currentTime = at; full.play().catch(() => {}); }, {once:true}); full.load(); }
  }
  $('#playFilm').addEventListener('click', () => showFilm());
  $('#sourceToggle').addEventListener('click', event => {
    const open = event.currentTarget.getAttribute('aria-expanded') !== 'true';
    event.currentTarget.setAttribute('aria-expanded', String(open)); $('#sourceNotes').hidden = !open;
  });

  const people = {
    dostoevsky:{name:'陀思妥耶夫斯基',greeting:'请坐。你是带着书里的一个问题来的，还是有一件自己的事，想慢慢说？',demo:'若是初次相遇，可以先读《白夜》，听一个孤独者怎样走近别人；再读《罪与罚》，看看一个人怎样面对自己。'},
    raskolnikov:{name:'拉斯克尔尼科夫',greeting:'这屋子太小，念头却总是不肯停下来。你来，是想问我什么？',demo:'我总想证明，自己的生活不该只有眼前这间屋子。可我还没有弄清，究竟是现实困住了我，还是我不肯承认自己的脆弱。'}
  };
  const histories = {dostoevsky:[],raskolnikov:[]};
  let character = 'dostoevsky', chatBusy = false, chatAbort = null, voiceEnabled = false;
  function endpoint() { return storage.get('shijian-persona-endpoint'); }
  function drawChat() {
    const target = $('#chatMessages'); target.setAttribute('aria-busy', String(chatBusy)); target.replaceChildren();
    for (const message of [{role:'assistant',content:people[character].greeting,greeting:true},...histories[character]]) {
      const row = document.createElement('div'); row.className = `chat-message ${message.role}`;
      const label = document.createElement('small');
      label.textContent = message.role === 'user' ? '你' : `${people[character].name} · ${message.demo || message.greeting ? '示例' : 'AI 演绎'}`;
      const paragraph = document.createElement('p'); paragraph.textContent = message.content;
      row.append(label, paragraph); target.append(row);
    }
    target.scrollTop = target.scrollHeight;
    $('#chatMode').textContent = endpoint() ? '已设置后端地址 · 等待实际对话验证' : '示例模式 · 尚未连接后端';
    $('#chatSend').disabled = chatBusy; $('#chatSend').innerHTML = chatBusy ? '正在回应…' : `发送 ${arrow}`;
    $$('[data-character]').forEach(button => { button.disabled = chatBusy; button.setAttribute('aria-pressed', String(button.dataset.character === character)); });
  }
  $$('[data-open-chat]').forEach(button => button.addEventListener('click', () => { drawChat(); showDialog($('#chatDialog')); }));
  $$('[data-character]').forEach(button => button.addEventListener('click', () => { character = button.dataset.character; $('#chatStatus').textContent = ''; window.speechSynthesis?.cancel(); drawChat(); }));
  $$('[data-question]').forEach(button => button.addEventListener('click', () => { $('#chatInput').value = button.dataset.question; $('#chatInput').focus(); }));
  $('#chatClear').addEventListener('click', () => { if (chatBusy) return; histories[character] = []; window.speechSynthesis?.cancel(); drawChat(); });
  $('#chatSettings').addEventListener('click', () => { $('#endpointForm').hidden = !$('#endpointForm').hidden; $('#chatEndpoint').value = endpoint(); if (!$('#endpointForm').hidden) $('#chatEndpoint').focus(); });
  $('#endpointCancel').addEventListener('click', () => { $('#endpointForm').hidden = true; });
  $('#endpointForm').addEventListener('submit', event => {
    event.preventDefault(); const input = $('#chatEndpoint'), value = input.value.trim(); input.setCustomValidity('');
    try {
      if (value) { const url = new URL(value); if (url.username || url.password || url.hash || url.search || url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw Error(); }
    } catch { input.setCustomValidity('请填写 HTTPS 后端接口，或本机 localhost 地址。'); input.reportValidity(); return; }
    storage.set('shijian-persona-endpoint', value); $('#endpointForm').hidden = true; drawChat(); $('#chatStatus').textContent = value ? '地址已保存，发送消息即可验证连接。' : '已切换到示例模式。';
  });
  $('#chatEndpoint').addEventListener('input', event => event.target.setCustomValidity(''));
  function speak(text) {
    if (!voiceEnabled || !window.speechSynthesis || !text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang='zh-CN';utterance.rate=.93;
    const voice=window.speechSynthesis.getVoices().find(v=>/^zh/i.test(v.lang));
    if(voice)utterance.voice=voice;
    window.speechSynthesis.speak(utterance);
  }
  const stopVoice=document.createElement('button');stopVoice.type='button';stopVoice.textContent='停止回应';
  stopVoice.addEventListener('click',()=>{chatAbort?.abort();window.speechSynthesis?.cancel();});
  $('#voiceToggle').after(stopVoice);
  $('#voiceToggle').addEventListener('click', event => {
    if (!window.speechSynthesis) { $('#chatStatus').textContent = '此浏览器不支持朗读，可继续文字对话。'; return; }
    voiceEnabled = !voiceEnabled; event.currentTarget.setAttribute('aria-pressed', String(voiceEnabled)); event.currentTarget.textContent = voiceEnabled ? '边生成边朗读' : '朗读关闭'; if (!voiceEnabled) window.speechSynthesis.cancel();
  });
  $('#chatForm').addEventListener('submit', async event => {
    event.preventDefault(); if (chatBusy) return;
    const input = $('#chatInput'), content = input.value.trim(); if (!content) return;
    window.speechSynthesis?.cancel();
    const id = character, history = histories[id];const historyStart=history.length; history.push({role:'user',content}); input.value = ''; chatBusy = true; drawChat();
    if (!endpoint()) { history.push({role:'assistant',content:people[id].demo,demo:true}); chatBusy = false; drawChat(); $('#chatStatus').textContent = '这是固定示例。接入后端后可进行真实 AI 对话。'; speak(people[id].demo); return; }
    const controller = new AbortController(); chatAbort = controller;
    const timeout = setTimeout(() => controller.abort(), 90000);
    $('#chatStatus').textContent = '正在等待回应…';
    try {
      const response = await fetch(endpoint(), {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({character:id,messages:history.filter(message => !message.demo).slice(-12).map(({role,content}) => ({role,content})),length:'medium',thinking:false,stream:true}),signal:controller.signal});
      if(!response.ok){const data=await response.json();throw Error(data.error||'回应失败');}
      if(response.headers.get('content-type')?.includes('text/event-stream')){
        const message={role:'assistant',content:''};history.push(message);
        const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',speech='',finished=false;
        const consume=line=>{
          if(!line.startsWith('data:'))return;
          const raw=line.slice(5).trim();if(raw==='[DONE]'){finished=true;return;}if(!raw)return;
          const data=JSON.parse(raw);if(data.error)throw Error(data.error.message||'生成失败');
          const delta=data.choices?.[0]?.delta?.content;if(typeof delta!=='string')return;
          message.content+=delta;speech+=delta;drawChat();$('#chatStatus').textContent='正在回应…';
          let end;while((end=speech.search(/[。！？!?；\n]/))>=0){speak(speech.slice(0,end+1));speech=speech.slice(end+1);}
        };
        while(true){const {value,done}=await reader.read();buffer+=decoder.decode(value||new Uint8Array(),{stream:!done});let at;while((at=buffer.indexOf('\n'))>=0){consume(buffer.slice(0,at).replace(/\r$/,''));buffer=buffer.slice(at+1);}if(done)break;}
        if(buffer.trim())consume(buffer);if(!finished||!message.content.trim())throw Error('回应连接中断，请重试');speak(speech);
      }else{
        const data=await response.json();if(typeof data.reply!=='string'||!data.reply.trim())throw Error('后端没有返回有效回应');
        history.push({role:'assistant',content:data.reply});speak(data.reply);
      }
      $('#chatStatus').textContent='';
    } catch (error) { window.speechSynthesis?.cancel();history.splice(historyStart); input.value = content; $('#chatStatus').textContent = error.name === 'AbortError' ? '已停止回应，可修改问题后重新发送。' : `${error.message} 请检查连接设置。`; }
    finally { clearTimeout(timeout); chatBusy = false; chatAbort = null; drawChat(); }
  });

  renderBooks(); selectScene(0); applyMotionMode();
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); reveal.unobserve(entry.target); } }), {threshold:.08});
    $$('.intro-heading,.intro-body,.featured-image,.featured-copy,.section-heading,.reading-copy,.reading-image,.author-portrait,.author-copy').forEach(element => { element.classList.add('reveal-ready'); if (!reduced.matches && element.getBoundingClientRect().top > innerHeight) element.classList.add('will-reveal'); reveal.observe(element); });
  }
})();
