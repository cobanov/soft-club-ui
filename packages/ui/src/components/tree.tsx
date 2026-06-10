import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";

export interface TreeNode {
  children?: TreeNode[];
  defaultExpanded?: boolean;
  id: string;
  label: React.ReactNode;
}

interface TreeContextValue {
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const TreeContext = React.createContext<TreeContextValue>({});

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect"> {
  defaultSelectedId?: string;
  items: TreeNode[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const TreeBranch = ({ node, level }: { level: number; node: TreeNode }) => {
  const { onSelect, selectedId } = React.useContext(TreeContext);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const [expanded, setExpanded] = React.useState(node.defaultExpanded ?? level === 0);
  const selected = selectedId === node.id;

  return (
    <li className="sc-tree__branch" role="treeitem" aria-expanded={hasChildren ? expanded : undefined}>
      <div
        className={cx("sc-tree__row", selected && "sc-tree__row--selected")}
        onClick={() => {
          if (hasChildren) setExpanded((value) => !value);
          onSelect?.(node.id);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (hasChildren) setExpanded((value) => !value);
            onSelect?.(node.id);
          }
        }}
        role="button"
        style={{ paddingLeft: `calc(${level} * var(--sc-space-4) + var(--sc-space-2))` }}
        tabIndex={0}
      >
        <ChevronRight
          aria-hidden="true"
          className={cx(
            "sc-tree__chevron",
            hasChildren && expanded && "sc-tree__chevron--open",
            !hasChildren && "sc-tree__chevron--hidden"
          )}
          size={14}
          strokeWidth={1.9}
        />
        <span className="sc-tree__label">{node.label}</span>
      </div>
      {hasChildren && expanded ? (
        <ul className="sc-tree__group" role="group">
          {node.children!.map((child) => (
            <TreeBranch key={child.id} level={level + 1} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

/**
 * A collapsible tree for nested data. Branches expand on click, leaves report
 * selection, and indentation follows depth via a spacing token.
 */
export const Tree = React.forwardRef<HTMLUListElement, TreeProps>(
  ({ className, defaultSelectedId, items, onSelect, selectedId: selectedProp, ...props }, ref) => {
    const isControlled = selectedProp !== undefined;
    const [internal, setInternal] = React.useState(defaultSelectedId);
    const selectedId = isControlled ? selectedProp : internal;

    const handleSelect = React.useCallback(
      (id: string) => {
        if (!isControlled) setInternal(id);
        onSelect?.(id);
      },
      [isControlled, onSelect]
    );

    const context = React.useMemo(
      () => ({ onSelect: handleSelect, selectedId }),
      [handleSelect, selectedId]
    );

    return (
      <TreeContext.Provider value={context}>
        <ul className={cx("sc-tree", className)} ref={ref} role="tree" {...props}>
          {items.map((node) => (
            <TreeBranch key={node.id} level={0} node={node} />
          ))}
        </ul>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = "Tree";
