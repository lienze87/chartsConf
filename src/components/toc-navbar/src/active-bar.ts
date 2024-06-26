import { isClient } from '@vueuse/core';
import type { Ref } from 'vue';
import { onMounted, onUnmounted, onUpdated } from 'vue';

import { throttleAndDebounce } from './utils';

export function useActiveSidebarLinks(container: Ref<HTMLElement>, marker: Ref<HTMLElement>) {
  if (!isClient) return;

  const onScroll = throttleAndDebounce(setActiveLink, 150);
  function setActiveLink() {
    const sidebarLinks = getSidebarLinks();
    const anchors = getAnchors(sidebarLinks);

    // Cancel the processing of the anchor point being forced to be the last one in the storefront
    // if (
    //   anchors.length &&
    //   scrollDom &&
    //   scrollDom.scrollTop + scrollDom.clientHeight === scrollDom.scrollHeight
    // ) {
    //   activateLink(anchors[anchors.length - 1].hash)
    //   return
    // }
    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];
      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor);

      if (isActive) {
        // history.replaceState(null, document.title, hash ? (hash as string) : ' ')
        activateLink(hash as string);
        return;
      }
    }
  }

  let prevActiveLink: HTMLAnchorElement | null = null;

  function activateLink(hash: string) {
    deActiveLink(prevActiveLink);

    const activeLinkAnchor = container.value.querySelector(
      `.toc-item a[href="${decodeURIComponent(hash)}"]`,
    ) as HTMLAnchorElement;

    prevActiveLink = activeLinkAnchor;

    if (activeLinkAnchor) {
      activeLinkAnchor.classList.add('active');
      marker.value.style.opacity = '1';
      marker.value.style.top = `${activeLinkAnchor.offsetTop}px`;
    } else {
      marker.value.style.opacity = '0';
      marker.value.style.top = '33px';
    }
  }

  function deActiveLink(link: HTMLElement | null) {
    if (link) {
      link.classList.remove('active');
    }
  }

  onMounted(() => {
    window.requestAnimationFrame(setActiveLink);
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUpdated(() => {
    if (window.location.hash) {
      activateLink(window.location.hash);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });
}

function getSidebarLinks() {
  return Array.from(document.querySelectorAll('.toc-content .toc-link')) as HTMLAnchorElement[];
}

function getAnchors(sidebarLinks: HTMLAnchorElement[]) {
  return (Array.from(document.querySelectorAll('.doc-content .header-anchor')) as HTMLAnchorElement[]).filter(
    (anchor) => sidebarLinks.some((sidebarLink) => sidebarLink.hash === anchor.hash),
  );
}
function getPageOffset() {
  // return (document.querySelector(".fixed-header") as HTMLElement).offsetHeight;
  return 0;
}
function getAnchorTop(anchor: HTMLAnchorElement) {
  const pageOffset = getPageOffset();
  try {
    return anchor.parentElement!.offsetTop - pageOffset;
  } catch {
    return 0;
  }
}
function isAnchorActive(index: number, anchor: HTMLAnchorElement, nextAnchor: HTMLAnchorElement) {
  const scrollTop = window.scrollY;

  if (index === 0 && scrollTop === 0) {
    return [true, null];
  }
  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null];
  }
  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, decodeURIComponent(anchor.hash)];
  }
  return [false, null];
}
