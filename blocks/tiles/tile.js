import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const initialCount = 3;
  const loadCount = 3;

  let visibleCount = initialCount;

  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    const tileMeta = document.createElement('div');
    tileMeta.className = 'tile-meta';
    const tileMetaFlexBox = document.createElement('div');
    tileMeta.append(tileMetaFlexBox);
    const logoImg = document.createElement('img');
    tileMetaFlexBox.append(logoImg);
    const tileMetaBlock = document.createElement('div');
    tileMetaFlexBox.append(tileMetaBlock);
    [...li.children].forEach((div, liChildIndex) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'tile-image';
      } else if (liChildIndex === 1) {
        div.className = 'tile-body';
      } else if (liChildIndex === 2) {
        const span = document.createElement('span');
        span.textContent = div.children[0].textContent;
        tileMetaBlock.append(span);
        div.before(tileMeta);
        div.remove();
      } else if (liChildIndex === 3) {
        [...div.children].forEach((p, divChildIndex) => {
          const span = document.createElement('span');
          span.textContent = p.textContent;
          p.replaceWith(span);
          if(divChildIndex == 1 && span.childNodes.length == 1) {
            const metaDivider = document.createElement('span');
            metaDivider.textContent = '•';
            span.before(metaDivider);
          }
        });
        tileMetaBlock.append(div);
      } else if (liChildIndex === 4) {
        div.className = 'tile-tags';
        [...div.children].forEach((p, divChildIndex) => {
          const span = document.createElement('span');
          span.textContent = p.textContent;
          p.replaceWith(span);
        });
        tileMeta.append(div);
      }
    });

    if (index >= initialCount) {
      li.style.display = 'none';
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);

  if (ul.children.length > initialCount) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Read more insights >';
    loadMoreBtn.className = 'load-more-btn';

    loadMoreBtn.addEventListener('click', () => {
      const nextVisible = Math.min(visibleCount + loadCount, ul.children.length);
      for (let i = visibleCount; i < nextVisible; i++) {
        ul.children[i].style.display = '';
      }

      visibleCount = nextVisible;
      if (visibleCount >= ul.children.length) {
        loadMoreBtn.remove();
      }
    });
    block.append(loadMoreBtn);
  }

  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
}
