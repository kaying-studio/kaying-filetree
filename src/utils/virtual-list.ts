/**
 * 虚拟滚动列表工具
 * 对标 ChatGPT Codex 的 data-file-tree-virtualized-* 实现
 *
 * 核心思路：
 * - 只渲染可见区域内的行 + 上下缓冲行
 * - 通过 transform: translateY 偏移已渲染的行
 * - 维护一个占位 div 撑满总高度
 */

export interface VirtualRange {
  /** 第一个可见项的索引 */
  startIndex: number;
  /** 最后一个可见项的索引（不含） */
  endIndex: number;
  /** 可见区域上方需要 translateY 的偏移量 */
  offsetY: number;
  /** 所有项目的总高度 */
  totalHeight: number;
}

/**
 * 计算虚拟滚动中需要渲染的范围
 *
 * @param scrollTop 当前滚动容器的 scrollTop
 * @param viewportHeight 视口高度
 * @param itemCount 总项目数
 * @param itemHeight 每项高度
 * @param overscan 上下额外渲染的缓冲行数（默认 5）
 */
export function computeVirtualRange(
  scrollTop: number,
  viewportHeight: number,
  itemCount: number,
  itemHeight: number,
  overscan: number = 5,
): VirtualRange {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(itemCount, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;
  const totalHeight = itemCount * itemHeight;

  return { startIndex, endIndex, offsetY, totalHeight };
}

/**
 * 虚拟滚动管理器 — 监听滚动事件，计算需要渲染的行
 */
export class VirtualListManager {
  private scrollTop = 0;
  private viewportHeight = 0;
  private itemCount = 0;
  private itemHeight: number;
  private overscan: number;
  private renderCallback: (range: VirtualRange) => void;
  private scrollContainer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;

  constructor(
    itemHeight: number,
    overscan: number,
    renderCallback: (range: VirtualRange) => void,
  ) {
    this.itemHeight = itemHeight;
    this.overscan = overscan;
    this.renderCallback = renderCallback;
  }

  /** 绑定到滚动容器 */
  attach(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
    this.viewportHeight = scrollContainer.clientHeight;

    scrollContainer.addEventListener("scroll", this.onScroll, { passive: true });

    this.resizeObserver = new ResizeObserver(() => {
      this.viewportHeight = scrollContainer.clientHeight;
      this.scheduleRender();
    });
    this.resizeObserver.observe(scrollContainer);

    this.scheduleRender();
  }

  /** 解绑 */
  detach() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener("scroll", this.onScroll);
      this.scrollContainer = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** 更新项目总数 */
  setItemCount(count: number) {
    this.itemCount = count;
    this.scheduleRender();
  }

  /** 更新行高 */
  setItemHeight(height: number) {
    this.itemHeight = height;
    this.scheduleRender();
  }

  /** 滚动到指定索引 */
  scrollToIndex(index: number) {
    if (!this.scrollContainer) return;
    const targetTop = index * this.itemHeight;
    this.scrollContainer.scrollTop = targetTop;
  }

  private onScroll = () => {
    if (this.scrollContainer) {
      this.scrollTop = this.scrollContainer.scrollTop;
    }
    this.scheduleRender();
  };

  private scheduleRender() {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const range = computeVirtualRange(
        this.scrollTop,
        this.viewportHeight,
        this.itemCount,
        this.itemHeight,
        this.overscan,
      );
      this.renderCallback(range);
    });
  }
}
