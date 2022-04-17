import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sub-components/sortable-item';

interface Props<T> {
  list: T[];
  onChange: (list: T[]) => void;
}

export interface SortableListItemProps {
  id: string;
  title: string;
  description?: string;
}

const SortableList = <T extends SortableListItemProps>(
  props: Props<T>,
): JSX.Element => {
  const { list, onChange } = props;
  const [items, setItems] = useState<T[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(list);
  }, [list]);

  useEffect(() => {
    if (items.length) {
      onChange(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleDragEnd = (event: any): void => {
    const { active, over } = event;

    if (active.id !== over.id) {
      let oldIndex: number;
      let newIndex: number;

      setItems(prev => {
        prev.forEach((item: T, index: number) => {
          if (item.id === active.id) {
            oldIndex = index;
          }
        });

        prev.forEach((item: T, index: number) => {
          if (item.id === over.id) {
            newIndex = index;
          }
        });

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items as any}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: T, index: number) => (
          <SortableItem<T>
            key={item.id}
            data={item}
            id={item.id}
            index={index}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
