import { Fragment, Static, type VNode } from 'vue';

import {
  MAX_ELEMENTS_PER_COMPONENT,
  SHAPE_COMPONENT,
  SHAPE_COMPONENT_KEPT_ALIVE,
  SHAPE_SUSPENSE,
  SHAPE_TELEPORT,
} from './constants';

/** Internal vnode fields Vue does not publish. */
type InternalVNode = Omit<VNode, 'component'> & {
  anchor: Node | null;
  targetStart?: Node | null;
  targetAnchor?: Node | null;
  suspense?: { activeBranch: VNode | null } | null;
  component?: { subTree: VNode } | null;
};

/**
 * Walk siblings collecting elements. `to` is exclusive unless `isInclusive`.
 * A null `to` would run to the end of the parent's child list, so callers must
 * only pass a boundary they know exists.
 */
const collect = (from: Node | null, to: Node | null, isInclusive: boolean) => {
  const elements: Element[] = [];
  let node = from;

  while (node && elements.length < MAX_ELEMENTS_PER_COMPONENT) {
    if (node === to && !isInclusive) {
      break;
    }

    if (node instanceof Element) {
      elements.push(node);
    }

    if (node === to) {
      break;
    }

    node = node.nextSibling;
  }

  return elements;
};

const isTeleportDisabled = (vnode: InternalVNode) => {
  const disabled = vnode.props?.disabled;

  return disabled === true || disabled === '';
};

/**
 * A component's root vnode to the elements it actually painted.
 *
 * The load-bearing detail: `anchor` is initialised to `null` and only Fragment,
 * Teleport and Static ever assign it. A component vnode copies `el` up from its
 * child but never `anchor`, so a sibling walk on one runs off the end of the
 * parent — hence the unwrap loop first. Returns `[]` wherever there is nothing
 * honest to draw.
 */
export const resolveElements = (root: VNode | null): Element[] => {
  let vnode = root as InternalVNode | null;
  let depth = 0;

  while (vnode && vnode.shapeFlag & SHAPE_COMPONENT) {
    /** A deactivated KeepAlive subtree lives in a detached container. */
    if (vnode.shapeFlag & SHAPE_COMPONENT_KEPT_ALIVE || !vnode.component) {
      return [];
    }

    if (++depth > 50) {
      return [];
    }

    vnode = vnode.component.subTree as InternalVNode;
  }

  if (!vnode) {
    return [];
  }

  if (vnode.shapeFlag & SHAPE_SUSPENSE) {
    const branch = vnode.suspense?.activeBranch;

    return branch ? resolveElements(branch) : [];
  }

  if (vnode.shapeFlag & SHAPE_TELEPORT) {
    /** Enabled: `el`/`anchor` are adjacent comments left behind in the source
        container, so the content is only reachable through the target pair. */
    if (!isTeleportDisabled(vnode)) {
      return vnode.targetStart && vnode.targetAnchor
        ? collect(vnode.targetStart.nextSibling, vnode.targetAnchor, false)
        : [];
    }

    return vnode.anchor ? collect(vnode.el as Node, vnode.anchor, false) : [];
  }

  if (vnode.type === Fragment) {
    return vnode.anchor
      ? collect((vnode.el as Node)?.nextSibling, vnode.anchor, false)
      : [];
  }

  /** Static is the one case whose anchor is the last node rather than a marker. */
  if (vnode.type === Static) {
    return vnode.anchor ? collect(vnode.el as Node, vnode.anchor, true) : [];
  }

  return vnode.el instanceof Element ? [vnode.el] : [];
};
