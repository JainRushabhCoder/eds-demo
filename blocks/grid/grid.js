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

    const gridCardMeta = document.createElement('div');
    gridCardMeta.className = 'grid-card-meta';
    const gridCardMetaFlexBox = document.createElement('div');
    gridCardMetaFlexBox.className = 'grid-card-meta-flex-box';
    gridCardMeta.append(gridCardMetaFlexBox);
    const logoImg = document.createElement('img');
    gridCardMetaFlexBox.append(logoImg);
    const gridCardMetaBlock = document.createElement('div');
    gridCardMetaFlexBox.append(gridCardMetaBlock);
    [...li.children].forEach((div, liChildIndex) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'grid-card-image';
      } else if (liChildIndex === 1) {
        div.className = 'grid-card-body';
      } else if (liChildIndex === 2) {
        const span = document.createElement('span');
        span.textContent = div.children[0].textContent;
        gridCardMetaBlock.append(span);
        div.before(gridCardMeta);
        div.remove();
      } else if (liChildIndex === 3) {
        div.className = 'card-meta';
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
        gridCardMetaBlock.append(div);
      } else if (liChildIndex === 4) {
        div.className = 'card-tags';
        [...div.children].forEach((p, divChildIndex) => {
          const span = document.createElement('span');
          span.textContent = p.textContent;
          p.replaceWith(span);
        });
        gridCardMeta.append(div);
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
    loadMoreBtn.className = 'grid-load-more';

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

  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  header.style.display = 'none';
  footer.style.display = 'none';
}
